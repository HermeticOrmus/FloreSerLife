# FloreSer Archetype Agents - Custom Agents

This sacred grove contains specialized Claude Code agents, each embodying one of the four FloreSer pollinator archetypes to guide the wellness marketplace platform.

## Our Pollinator Guides

### 🐝 Maia (Bee)
**Archetype**: Grounding and foundational support
**Role**: Wellness marketplace guide and community builder
**Best For**:
- Foundational wellness feature development
- Practitioner archetype system and community structures
- Grounding marketplace decisions in authentic healing traditions
- Building essential support systems for practitioners and clients

### 🪲 Bodhi (Beetle)
**Archetype**: Deep integration and shadow work
**Role**: Database architect and complex system healer
**Best For**:
- Deep database architecture and schema transformation
- Complex data relationship healing and integration
- Shadow work with challenging technical problems
- Profound system optimization and foundational repairs

### 🦋 Angelica (Hummingbird)
**Archetype**: Precise insight and spiritual guidance
**Role**: API designer and authentication specialist
**Best For**:
- Precise API design with spiritual awareness
- Authentication systems that honor user sacred space
- Insightful service connections and security guidance
- Sacred practices in technical implementations

### 🦋 Luna (Butterfly)
**Archetype**: Life transitions and transformation
**Role**: UI/UX transformation specialist
**Best For**:
- Interface metamorphosis from complexity to beauty
- User experience transitions and transformative journeys
- Helping frontend code evolve through life cycles
- Guiding users through meaningful digital transformations

## How to Import External Agents

### From Local Computer
1. Copy agent `.md` files to `.claude/agents/` directory
2. Ensure proper YAML frontmatter format:
```yaml
---
name: agent-name
description: What this agent does
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---
```

### From Git Repository
1. Clone or download agent files from repository
2. Copy `.md` files to `.claude/agents/` directory
3. Agents will be automatically available in Claude Code

### Agent File Format
```markdown
---
name: unique-agent-name
description: Brief description of when to use this agent
tools: comma, separated, tool, list  # Optional
model: sonnet  # Optional (defaults to current model)
---

System prompt and instructions for the agent go here.
Include expertise areas, responsibilities, and best practices.
```

### Management Commands
- Use `/agents` command in Claude Code for interactive management
- View, create, edit, and delete agents through the CLI interface
- Project-level agents (this directory) take precedence over user-level agents

## Best Practices

### Creating Agents
1. **Specific Purpose**: Each agent should have a clear, focused role
2. **Tool Access**: Only grant necessary tools for the agent's tasks
3. **Domain Expertise**: Include relevant knowledge and context
4. **Consistent Format**: Follow the established YAML frontmatter pattern

### Naming Conventions
- Use lowercase with hyphens: `wellness-consultant`
- Be descriptive but concise
- Avoid conflicts with built-in agents

### Version Control
These agents are part of the project repository and can be:
- Shared with team members via Git
- Version controlled with the codebase
- Customized per environment or branch

## Calling Upon the Pollinator Archetypes

When seeking wisdom from our archetype guides:

For grounding wellness guidance (Bee):
```
@maia-bee Please review this practitioner matching algorithm to ensure it supports foundational healing relationships
```

For deep integration work (Beetle):
```
@bodhi-beetle Help me design a schema for session booking that transforms complex relationships into healed data structures
```

For precise API insight (Hummingbird):
```
@angelica-hummingbird Create endpoints for the Seeds currency system with spiritual awareness of user energy flows
```

For transformative interface work (Butterfly):
```
@luna-butterfly Guide this complex booking interface through metamorphosis into a beautiful, intuitive experience
```

## Contributing

When adding new agents:
1. Create descriptive `.md` file in this directory
2. Include comprehensive expertise areas
3. Test agent functionality before committing
4. Update this README with agent information

---

*These agents are specifically designed for the FloreSer wellness marketplace and incorporate platform-specific knowledge and patterns.*