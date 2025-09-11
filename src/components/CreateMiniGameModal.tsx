import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Gamepad2, Plus, Trophy, Coins, Users, Timer, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CreateMiniGameModalProps {
  isOpen: boolean
  onClose: () => void
  onGameCreated?: (game: any) => void
}

interface FamilyMember {
  id: string
  name: string
  role: string
}

interface Reward {
  id: string
  name: string
  description: string
  pointCost: number
}

const mockFamilyMembers: FamilyMember[] = [
  { id: '1', name: 'John Johnson', role: 'parent' },
  { id: '2', name: 'Sarah Johnson', role: 'parent' },
  { id: '3', name: 'Emma Johnson', role: 'child' },
  { id: '4', name: 'Alex Johnson', role: 'child' }
]

const mockRewards: Reward[] = [
  { id: '1', name: 'Movie Night', description: 'Family movie night with popcorn', pointCost: 100 },
  { id: '2', name: 'Ice Cream Trip', description: 'Trip to favorite ice cream shop', pointCost: 50 },
  { id: '3', name: 'Extra Screen Time', description: '30 minutes extra screen time', pointCost: 25 },
  { id: '4', name: 'Choose Dinner', description: 'Pick the family dinner for the week', pointCost: 75 }
]

export function CreateMiniGameModal({ isOpen, onClose, onGameCreated }: CreateMiniGameModalProps) {
  const { toast } = useToast()
  const [gameData, setGameData] = useState({
    title: '',
    description: '',
    category: '',
    gameType: 'quiz',
    difficulty: 'medium',
    duration: 10, // minutes
    rewardType: 'points' as 'points' | 'reward',
    pointValue: 25,
    selectedReward: '',
    customReward: {
      name: '',
      description: ''
    },
    questions: [{ question: '', answers: ['', '', '', ''], correctAnswer: 0 }],
    instructions: ''
  })
  
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [showCustomReward, setShowCustomReward] = useState(false)

  const handleMemberSelection = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers([...selectedMembers, memberId])
    } else {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId))
    }
  }

  const addQuestion = () => {
    setGameData({
      ...gameData,
      questions: [...gameData.questions, { question: '', answers: ['', '', '', ''], correctAnswer: 0 }]
    })
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = gameData.questions.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    )
    setGameData({ ...gameData, questions: updatedQuestions })
  }

  const updateAnswer = (questionIndex: number, answerIndex: number, value: string) => {
    const updatedQuestions = gameData.questions.map((q, i) => 
      i === questionIndex 
        ? { ...q, answers: q.answers.map((a, ai) => ai === answerIndex ? value : a) }
        : q
    )
    setGameData({ ...gameData, questions: updatedQuestions })
  }

  const removeQuestion = (index: number) => {
    if (gameData.questions.length > 1) {
      setGameData({
        ...gameData,
        questions: gameData.questions.filter((_, i) => i !== index)
      })
    }
  }

  const handleCreateGame = () => {
    if (!gameData.title || !gameData.description || selectedMembers.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one family member.",
        variant: "destructive"
      })
      return
    }

    if (gameData.gameType === 'quiz' && gameData.questions.some(q => !q.question || q.answers.some(a => !a))) {
      toast({
        title: "Incomplete Questions",
        description: "Please fill in all questions and answers.",
        variant: "destructive"
      })
      return
    }

    if (gameData.rewardType === 'reward' && !gameData.selectedReward && !showCustomReward) {
      toast({
        title: "Missing Reward",
        description: "Please select a reward or create a custom reward.",
        variant: "destructive"
      })
      return
    }

    if (showCustomReward && (!gameData.customReward.name || !gameData.customReward.description)) {
      toast({
        title: "Missing Custom Reward",
        description: "Please fill in custom reward name and description.",
        variant: "destructive"
      })
      return
    }

    const newGame = {
      id: Date.now().toString(),
      title: gameData.title,
      description: gameData.description,
      category: gameData.category,
      gameType: gameData.gameType,
      difficulty: gameData.difficulty,
      duration: gameData.duration,
      participants: selectedMembers,
      rewardType: gameData.rewardType,
      ...(gameData.rewardType === 'points' 
        ? { pointValue: gameData.pointValue }
        : showCustomReward 
          ? { customReward: gameData.customReward }
          : { rewardId: gameData.selectedReward }
      ),
      questions: gameData.gameType === 'quiz' ? gameData.questions : undefined,
      instructions: gameData.instructions || undefined,
      status: 'active',
      plays: 0,
      createdBy: 'current-user',
      createdAt: new Date().toISOString()
    }

    onGameCreated?.(newGame)
    
    // Reset form
    setGameData({
      title: '',
      description: '',
      category: '',
      gameType: 'quiz',
      difficulty: 'medium',
      duration: 10,
      rewardType: 'points',
      pointValue: 25,
      selectedReward: '',
      customReward: { name: '', description: '' },
      questions: [{ question: '', answers: ['', '', '', ''], correctAnswer: 0 }],
      instructions: ''
    })
    setSelectedMembers([])
    setShowCustomReward(false)
    
    toast({
      title: "Game Created!",
      description: `${gameData.title} has been created successfully.`,
    })
    
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gamepad2 className="h-5 w-5" />
            Create New Mini-Game
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Game Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Game Title *</Label>
                <Input
                  id="title"
                  value={gameData.title}
                  onChange={(e) => setGameData({ ...gameData, title: e.target.value })}
                  placeholder="Enter game title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={gameData.description}
                  onChange={(e) => setGameData({ ...gameData, description: e.target.value })}
                  placeholder="Describe what this game is about"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={gameData.category} onValueChange={(value) => setGameData({ ...gameData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="nutrition">Nutrition</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="trivia">Trivia</SelectItem>
                      <SelectItem value="memory">Memory</SelectItem>
                      <SelectItem value="creativity">Creativity</SelectItem>
                      <SelectItem value="family">Family Fun</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="game-type">Game Type</Label>
                  <Select value={gameData.gameType} onValueChange={(value) => setGameData({ ...gameData, gameType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="memory">Memory Game</SelectItem>
                      <SelectItem value="challenge">Quick Challenge</SelectItem>
                      <SelectItem value="trivia">Trivia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={gameData.difficulty} onValueChange={(value) => setGameData({ ...gameData, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={gameData.duration}
                  onChange={(e) => setGameData({ ...gameData, duration: parseInt(e.target.value) || 1 })}
                  min="1"
                  max="60"
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>

          {/* Game Content */}
          {gameData.gameType === 'quiz' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Quiz Questions</span>
                  <Button onClick={addQuestion} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Question
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {gameData.questions.map((question, qIndex) => (
                  <Card key={qIndex}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
                        {gameData.questions.length > 1 && (
                          <Button 
                            onClick={() => removeQuestion(qIndex)} 
                            size="sm" 
                            variant="destructive"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Question *</Label>
                        <Input
                          value={question.question}
                          onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                          placeholder="Enter your question"
                        />
                      </div>
                      
                      <div>
                        <Label>Answers *</Label>
                        <div className="space-y-2">
                          {question.answers.map((answer, aIndex) => (
                            <div key={aIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={question.correctAnswer === aIndex}
                                onChange={() => updateQuestion(qIndex, 'correctAnswer', aIndex)}
                                className="w-4 h-4 rounded-full border border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              />
                              <Input
                                value={answer}
                                onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
                                placeholder={`Answer ${aIndex + 1}`}
                                className="flex-1"
                              />
                              <span className="text-xs text-muted-foreground">
                                {question.correctAnswer === aIndex ? 'Correct' : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Select the radio button next to the correct answer
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {gameData.gameType !== 'quiz' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Game Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={gameData.instructions}
                    onChange={(e) => setGameData({ ...gameData, instructions: e.target.value })}
                    placeholder="Explain how to play this game"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Family Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-4 w-4" />
                Available For *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockFamilyMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={member.id}
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={(checked) => handleMemberSelection(member.id, !!checked)}
                    />
                    <Label htmlFor={member.id} className="flex items-center gap-2">
                      <span>{member.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">({member.role})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reward System */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reward System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={gameData.rewardType}
                onValueChange={(value: 'points' | 'reward') => setGameData({ ...gameData, rewardType: value })}
              >
                <Label htmlFor="points" className="flex items-center gap-2 text-sm cursor-pointer">
                  <RadioGroupItem value="points" id="points" />
                  <Coins className="h-4 w-4" />
                  Points Reward
                </Label>
                <Label htmlFor="reward" className="flex items-center gap-2 text-sm cursor-pointer">
                  <RadioGroupItem value="reward" id="reward" />
                  <Trophy className="h-4 w-4" />
                  Item Reward
                </Label>
              </RadioGroup>

              {gameData.rewardType === 'points' && (
                <div>
                  <Label htmlFor="point-value">Point Value</Label>
                  <Input
                    id="point-value"
                    type="number"
                    value={gameData.pointValue}
                    onChange={(e) => setGameData({ ...gameData, pointValue: parseInt(e.target.value) || 0 })}
                    min="1"
                    max="500"
                    className="w-32"
                  />
                </div>
              )}

              {gameData.rewardType === 'reward' && (
                <div className="space-y-4">
                  <div>
                    <Label>Select Reward</Label>
                    <Select 
                      value={showCustomReward ? 'custom' : gameData.selectedReward} 
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          setShowCustomReward(true)
                          setGameData({ ...gameData, selectedReward: '' })
                        } else {
                          setShowCustomReward(false)
                          setGameData({ ...gameData, selectedReward: value })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a reward" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockRewards.map((reward) => (
                          <SelectItem key={reward.id} value={reward.id}>
                            {reward.name} ({reward.pointCost} points)
                          </SelectItem>
                        ))}
                        <Separator />
                        <SelectItem value="custom">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create Custom Reward
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {showCustomReward && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Custom Reward</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label htmlFor="custom-reward-name">Reward Name *</Label>
                          <Input
                            id="custom-reward-name"
                            value={gameData.customReward.name}
                            onChange={(e) => setGameData({
                              ...gameData,
                              customReward: { ...gameData.customReward, name: e.target.value }
                            })}
                            placeholder="Enter reward name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="custom-reward-description">Description *</Label>
                          <Textarea
                            id="custom-reward-description"
                            value={gameData.customReward.description}
                            onChange={(e) => setGameData({
                              ...gameData,
                              customReward: { ...gameData.customReward, description: e.target.value }
                            })}
                            placeholder="Describe the reward"
                            rows={2}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          This custom reward will only be visible to your family.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCreateGame}>
              Create Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}