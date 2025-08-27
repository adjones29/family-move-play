import { 
  Dumbbell, 
  Target, 
  Zap, 
  Heart, 
  Users, 
  Gamepad2,
  Gift,
  Home,
  MapPin,
  Cake,
  Pizza,
  ShoppingBag,
  Car,
  Popcorn
} from "lucide-react"

// Map icon names from database to actual icon components
export const iconMap = {
  'dumbbell': Dumbbell,
  'target': Target,
  'zap': Zap,
  'heart': Heart,
  'users': Users,
  'gamepad2': Gamepad2,
  'gift': Gift,
  'home': Home,
  'map-pin': MapPin,
  'cake': Cake,
  'pizza': Pizza,
  'shopping-bag': ShoppingBag,
  'car': Car,
  'popcorn': Popcorn
}

export function getIconComponent(iconName?: string) {
  if (!iconName) return Gamepad2 // Default icon
  return iconMap[iconName as keyof typeof iconMap] || Gamepad2
}