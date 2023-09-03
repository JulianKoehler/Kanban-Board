export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  large?: boolean;
  variant?: "primary" | "secondary" | "destructive";
}
