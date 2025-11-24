"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { LinkIcon, Trash2, Search, CheckCircle } from "lucide-react"

interface MCPTool {
  id: string
  name: string
  description: string
  url: string
  connected: boolean
}

interface MCPServer {
  url: string
  status: "online" | "offline" | "connecting"
  tools: MCPTool[]
}

interface MCPDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onToolsUpdate: (tools: MCPTool[]) => void
}

export function MCPDrawer({ open, onOpenChange, onToolsUpdate }: MCPDrawerProps) {
  const [mcpServers, setMcpServers] = useState<MCPServer[]>([])
  const [currentMcpUrl, setCurrentMcpUrl] = useState("")
  const [toolSearch, setToolSearch] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleMcpConnect = async () => {
    if (!currentMcpUrl.trim() || mcpServers.some((server) => server.url === currentMcpUrl)) return

    setIsConnecting(true)

    const newServer: MCPServer = {
      url: currentMcpUrl,
      status: "connecting",
      tools: [],
    }

    setMcpServers((prev) => [...prev, newServer])

    setTimeout(() => {
      const mockTools: MCPTool[] = [
        {
          id: `mcp-1`,
          name: "Custom Search",
          description: "Advanced search capabilities from MCP server",
          url: currentMcpUrl,
          connected: true,
        },
        {
          id: `mcp-2`,
          name: "Data Processor",
          description: "Process and analyze data via MCP",
          url: currentMcpUrl,
          connected: true,
        },
        {
          id: `mcp-3`,
          name: "File Handler",
          description: "Handle file operations through MCP",
          url: currentMcpUrl,
          connected: true,
        },
      ]

      setMcpServers((prev) =>
        prev.map((server) =>
          server.url === currentMcpUrl ? { ...server, status: "online" as const, tools: mockTools } : server,
        ),
      )

      const allMcpTools = mcpServers.flatMap((s) => s.tools).concat(mockTools)
      onToolsUpdate(allMcpTools)

      setCurrentMcpUrl("")
      setIsConnecting(false)
    }, 2000)
  }

  const handleRemoveMcpServer = (urlToRemove: string) => {
    setMcpServers((prev) => prev.filter((server) => server.url !== urlToRemove))

    const remainingTools = mcpServers.filter((server) => server.url !== urlToRemove).flatMap((server) => server.tools)
    onToolsUpdate(remainingTools)
  }

  const allMcpTools = mcpServers.flatMap((server) => server.tools)
  const filteredMcpTools = allMcpTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      tool.description.toLowerCase().includes(toolSearch.toLowerCase()),
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] flex flex-col">
        <div className="p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold">MCP Server Management</h2>
          <p className="text-sm text-muted-foreground">Connect to MCP servers to discover additional tools</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Add MCP Server */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Add MCP Server</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter MCP server URL..."
                  value={currentMcpUrl}
                  onChange={(e) => setCurrentMcpUrl(e.target.value)}
                  className="pl-10"
                  disabled={isConnecting}
                />
              </div>
              <Button onClick={handleMcpConnect} disabled={!currentMcpUrl.trim() || isConnecting}>
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            </div>
          </div>

          {/* Connected Servers */}
          {mcpServers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Connected Servers</h3>
              <div className="space-y-2">
                {mcpServers.map((server, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {server.status === "online" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                          {server.status === "offline" && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                          {server.status === "connecting" && (
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                          )}
                          <span className="text-xs font-medium capitalize">{server.status}</span>
                        </div>
                        <span className="text-sm font-mono truncate flex-1">{server.url}</span>
                        <Badge variant="outline" className="text-xs">
                          {server.tools.length} tools
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMcpServer(server.url)}
                        className="h-8 w-8 p-0 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Available Tools */}
          {allMcpTools.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Discovered Tools</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tools..."
                    value={toolSearch}
                    onChange={(e) => setToolSearch(e.target.value)}
                    className="pl-10 h-8 w-48"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {filteredMcpTools.map((tool) => (
                  <Card key={tool.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium">{tool.name}</Label>
                          <Badge variant="secondary" className="text-xs">
                            MCP
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                        <p className="text-xs text-muted-foreground font-mono">{tool.url}</p>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">Available</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {allMcpTools.length === 0 && mcpServers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No MCP servers connected</p>
              <p className="text-xs">Add a server URL above to discover tools</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
