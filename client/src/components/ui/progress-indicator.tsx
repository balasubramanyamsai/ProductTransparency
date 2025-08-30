import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function ProgressIndicator({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={cn(
                  "progress-step flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300",
                  isCompleted && "completed bg-accent text-accent-foreground",
                  isActive && "active bg-primary text-primary-foreground",
                  !isCompleted && !isActive && "bg-muted text-muted-foreground"
                )}
                data-testid={`progress-step-${stepNumber}`}
              >
                {stepNumber}
              </div>
              {i < totalSteps - 1 && (
                <div className="h-1 w-16 bg-border mx-2" />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center mt-4 space-x-16 text-sm text-muted-foreground">
        {stepLabels.map((label, i) => (
          <span
            key={i}
            className={cn(
              "transition-colors",
              i + 1 === currentStep && "text-foreground font-medium"
            )}
            data-testid={`step-label-${i + 1}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
