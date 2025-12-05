import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ItemType = 'challenge' | 'game' | 'reward';

const buildPrompt = (type: ItemType, title: string): string => {
  const prompts: Record<ItemType, string> = {
    challenge: `A vibrant, family-friendly digital illustration for a fitness challenge called "${title}". Show an active family exercising together, energetic mood, bright colors, modern flat design style, no text or words, portrait aspect ratio 2:3, ultra high resolution.`,
    game: `A fun, playful digital illustration for a family mini-game called "${title}". Show family members having fun together, game elements, cheerful mood, vibrant colors, cartoon style, no text or words, portrait aspect ratio 2:3, ultra high resolution.`,
    reward: `An exciting digital illustration for a family reward called "${title}". Celebration theme, gift or prize imagery, warm golden colors, achievement feeling, no text or words, portrait aspect ratio 2:3, ultra high resolution.`,
  };
  return prompts[type];
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, title, itemId } = await req.json();
    
    if (!type || !title || !itemId) {
      return new Response(
        JSON.stringify({ error: 'Missing type, title, or itemId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = buildPrompt(type as ItemType, title);
    console.log(`Generating card image for ${type}: "${title}" (${itemId})`);

    // Generate image using Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [{ role: 'user', content: prompt }],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI gateway error: ${response.status}`, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const base64Image = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!base64Image) {
      console.error('No image in response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'No image generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upload to Supabase Storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract base64 data and convert to binary
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    const folder = `${type}s`;
    const filename = `${itemId}.png`;
    const storagePath = `${folder}/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from('catalog-images')
      .upload(storagePath, binaryData, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      // Still return the base64 image even if storage fails
      return new Response(
        JSON.stringify({ imageUrl: base64Image, persisted: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('catalog-images')
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    // Update the database record with the image URL
    const tableName = type === 'challenge' ? 'challenges' : type === 'game' ? 'games' : 'rewards';
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ 
        image_url: publicUrl,
        image_bucket: 'catalog-images',
        image_folder: folder,
        image_filename: filename
      })
      .eq('id', itemId);

    if (updateError) {
      console.error('Database update error:', updateError);
    }

    console.log(`Image generated and stored successfully: ${publicUrl}`);
    return new Response(
      JSON.stringify({ imageUrl: publicUrl, persisted: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-card-image:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
