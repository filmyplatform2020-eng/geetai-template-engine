export interface WorkflowStep {
  name: string
  engine: string
  order: number
  required: boolean
  description: string
}

class WorkflowRegistry {
  private steps: WorkflowStep[] = []

  registerStep(step: WorkflowStep): void {
    const existing = this.steps.findIndex(
      (s) => s.engine === step.engine && s.name === step.name
    )
    if (existing >= 0) {
      this.steps[existing] = step
    } else {
      this.steps.push(step)
    }
  }

  getSteps(engine?: string): WorkflowStep[] {
    if (engine) {
      return this.steps
        .filter((s) => s.engine === engine)
        .sort((a, b) => a.order - b.order)
    }
    return [...this.steps].sort((a, b) => a.order - b.order)
  }

  getPipeline(): WorkflowStep[] {
    return this.getSteps()
  }

  clear(): void {
    this.steps = []
  }
}

export const workflowRegistry = new WorkflowRegistry()
