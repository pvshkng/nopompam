"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Brain,
  Search,
  Plus,
  Save,
  ImageIcon,
  Eye,
  Zap,
  Cpu,
  DollarSign,
  MessageSquare,
  Settings,
  ChevronDown,
} from "lucide-react"
import { MCPDrawer } from "./mcp-drawer"

interface LLMModel {
  id: string
  name: string
  provider: string
  capabilities: string[]
}

interface MCPTool {
  id: string
  name: string
  description: string
  url: string
  connected: boolean
}

interface Agent {
  id: string
  name: string
  description: string
  model: string
  tools: string[]
  mcpTools?: string[]
  customInstructions?: string
  temperature?: number
  topP?: number
  topK?: number
  isCustom?: boolean
}

const llmModels: LLMModel[] = [
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    capabilities: ["multimodal", "image-upload", "thinking"],
  },
  {
    id: "gemini-flash",
    name: "Gemini Flash",
    provider: "Google",
    capabilities: ["multimodal", "image-upload"],
  },
  {
    id: "llama-3.1-70b",
    name: "Llama 3.1 70B",
    provider: "Meta",
    capabilities: ["thinking", "reasoning"],
  },
  {
    id: "llama-3.1-8b",
    name: "Llama 3.1 8B",
    provider: "Meta",
    capabilities: ["fast-inference"],
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    capabilities: ["multimodal", "thinking", "reasoning"],
  },
  {
    id: "mistral-small",
    name: "Mistral Small",
    provider: "Mistral AI",
    capabilities: ["fast-inference", "cost-effective"],
  },
]

const tools = [
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the internet for current information",
  },
  {
    id: "artifact",
    name: "Artifact Generation",
    description: "Create and edit code artifacts",
  },
  {
    id: "image-generation",
    name: "Image Generation",
    description: "Generate images from text descriptions",
  },
  {
    id: "code-execution",
    name: "Code Execution",
    description: "Run and test code snippets",
  },
  {
    id: "file-analysis",
    name: "File Analysis",
    description: "Analyze uploaded files and documents",
  },
]

const defaultAgents: Agent[] = [
  {
    id: "researcher",
    name: "Researcher",
    description: "Specialized in gathering and analyzing information",
    model: "gemini-pro",
    tools: ["web-search", "file-analysis"],
    customInstructions:
      "You are a thorough researcher. Focus on finding credible sources, cross-referencing information, and providing comprehensive analysis with proper citations.",
    temperature: 0.3,
    topP: 0.9,
    topK: 40,
  },
  {
    id: "writer",
    name: "Writer",
    description: "Expert in content creation and editing",
    model: "gemini-pro",
    tools: ["artifact", "web-search"],
    customInstructions:
      "You are a skilled writer. Prioritize clarity, engagement, and proper structure in all written content. Use active voice and compelling narratives.",
    temperature: 0.7,
    topP: 0.9,
    topK: 50,
  },
  {
    id: "investor",
    name: "Investor",
    description: "Financial analysis and investment insights",
    model: "llama-3.1-70b",
    tools: ["web-search", "file-analysis", "code-execution"],
    customInstructions:
      "You are a financial analyst. Analyze data with risk assessment, market trend considerations, and provide actionable investment insights with proper disclaimers.",
    temperature: 0.2,
    topP: 0.8,
    topK: 30,
  },
  {
    id: "developer",
    name: "Developer",
    description: "Code generation and technical problem solving",
    model: "gemini-pro",
    tools: ["artifact", "code-execution", "file-analysis"],
    customInstructions:
      "You are an expert developer. Write clean, efficient code following best practices, include proper documentation, and consider security and performance.",
    temperature: 0.1,
    topP: 0.9,
    topK: 40,
  },
]

interface LLMDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LLMDrawer({ open, onOpenChange }: LLMDrawerProps) {
  const [selectedModel, setSelectedModel] = useState("gemini-pro")
  const [selectedTools, setSelectedTools] = useState<string[]>(["web-search"])
  const [customInstructions, setCustomInstructions] = useState("")
  const [toolSearch, setToolSearch] = useState("")
  const [mcpTools, setMcpTools] = useState<MCPTool[]>([])
  const [selectedMcpTools, setSelectedMcpTools] = useState<string[]>([])
  const [customAgents, setCustomAgents] = useState<Agent[]>([])
  const [isCreatingAgent, setIsCreatingAgent] = useState(false)
  const [newAgentName, setNewAgentName] = useState("")
  const [newAgentDescription, setNewAgentDescription] = useState("")
  const [temperature, setTemperature] = useState([0.7])
  const [topP, setTopP] = useState([0.9])
  const [topK, setTopK] = useState([40])
  const [mcpDrawerOpen, setMcpDrawerOpen] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const handleToolToggle = (toolId: string) => {
    setSelectedTools((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]))
  }

  const handleMcpToolToggle = (toolId: string) => {
    setSelectedMcpTools((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]))
  }

  const handleSaveAgent = () => {
    if (!newAgentName.trim()) return

    const newAgent: Agent = {
      id: `custom-${Date.now()}`,
      name: newAgentName,
      description: newAgentDescription || "Custom agent configuration",
      model: selectedModel,
      tools: selectedTools,
      mcpTools: selectedMcpTools,
      customInstructions: customInstructions,
      temperature: temperature[0],
      topP: topP[0],
      topK: topK[0],
      isCustom: true,
    }
    setCustomAgents((prev) => [...prev, newAgent])
    setIsCreatingAgent(false)
    setNewAgentName("")
    setNewAgentDescription("")
  }

  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case "multimodal":
        return <Eye className="h-3 w-3" />
      case "image-upload":
        return <ImageIcon className="h-3 w-3" />
      case "image-generation":
        return <ImageIcon className="h-3 w-3" />
      case "thinking":
        return <Brain className="h-3 w-3" />
      case "reasoning":
        return <MessageSquare className="h-3 w-3" />
      case "fast-inference":
        return <Zap className="h-3 w-3" />
      case "cost-effective":
        return <DollarSign className="h-3 w-3" />
      default:
        return <Cpu className="h-3 w-3" />
    }
  }

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      tool.description.toLowerCase().includes(toolSearch.toLowerCase()),
  )

  const filteredMcpTools = mcpTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      tool.description.toLowerCase().includes(toolSearch.toLowerCase()),
  )

  const allAgents = [...defaultAgents, ...customAgents]
  const selectedModelData = llmModels.find((m) => m.id === selectedModel)

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Model</h3>
              <div className="grid grid-cols-2 gap-2">
                {llmModels.map((model) => (
                  <Card
                    key={model.id}
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedModel === model.id ? "border-violet-400 bg-violet-50" : "hover:bg-violet-50"
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{model.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{model.provider}</div>
                      <div className="flex gap-1 flex-wrap">
                        {model.capabilities.map((cap) => (
                          <Badge key={cap} variant="secondary" className="text-xs px-1 py-0 flex items-center gap-1">
                            {getCapabilityIcon(cap)}
                            <span className="sr-only">{cap}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-between h-8 px-2">
                    <span className="text-xs">Advanced</span>
                    <ChevronDown className={`h-3 w-3 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pt-2">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <Label className="text-xs">Temp</Label>
                        <span className="text-xs text-muted-foreground">{temperature[0]}</span>
                      </div>
                      <Slider
                        value={temperature}
                        onValueChange={setTemperature}
                        max={2}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <Label className="text-xs">Top P</Label>
                        <span className="text-xs text-muted-foreground">{topP[0]}</span>
                      </div>
                      <Slider value={topP} onValueChange={setTopP} max={1} min={0} step={0.05} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <Label className="text-xs">Top K</Label>
                        <span className="text-xs text-muted-foreground">{topK[0]}</span>
                      </div>
                      <Slider value={topK} onValueChange={setTopK} max={100} min={1} step={1} className="w-full" />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Tools</h3>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={toolSearch}
                    onChange={(e) => setToolSearch(e.target.value)}
                    className="pl-7 h-7 w-24 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {filteredTools.map((tool) => (
                  <div key={tool.id} className="flex items-center space-x-2 p-2 rounded border">
                    <Checkbox
                      id={tool.id}
                      checked={selectedTools.includes(tool.id)}
                      onCheckedChange={() => handleToolToggle(tool.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <Label htmlFor={tool.id} className="text-xs font-medium cursor-pointer leading-tight">
                        {tool.name}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMcpTools.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  {filteredMcpTools.map((tool) => (
                    <div key={tool.id} className="flex items-center space-x-2 p-2 rounded border">
                      <Checkbox
                        id={tool.id}
                        checked={selectedMcpTools.includes(tool.id)}
                        onCheckedChange={() => handleMcpToolToggle(tool.id)}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <Label htmlFor={tool.id} className="text-xs font-medium cursor-pointer leading-tight">
                            {tool.name}
                          </Label>
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            MCP
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setMcpDrawerOpen(true)} className="h-7 px-2">
                  <Settings className="h-3 w-3 mr-1" />
                  MCP Servers
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsCreatingAgent(true)} className="h-7 px-2">
                  <Plus className="h-3 w-3 mr-1" />
                  Save Config
                </Button>
              </div>

              {isCreatingAgent && (
                <Card className="p-3 border-2 border-violet-300 bg-violet-50">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Save Current Configuration</h4>
                    <Input
                      placeholder="Configuration name..."
                      value={newAgentName}
                      onChange={(e) => setNewAgentName(e.target.value)}
                      className="h-8"
                    />
                    <Input
                      placeholder="Description..."
                      value={newAgentDescription}
                      onChange={(e) => setNewAgentDescription(e.target.value)}
                      className="h-8"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveAgent} disabled={!newAgentName.trim()}>
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsCreatingAgent(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">System Instructions</h3>
              <Textarea
                placeholder="Enter custom system instructions..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                className="min-h-[80px] resize-none text-sm"
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <MCPDrawer open={mcpDrawerOpen} onOpenChange={setMcpDrawerOpen} onToolsUpdate={setMcpTools} />
    </>
  )
}
