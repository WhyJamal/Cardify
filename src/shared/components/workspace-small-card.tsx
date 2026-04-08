import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const workspaceCardVariants = cva(
  "rounded-md flex items-center justify-center shrink-0 overflow-hidden",
  {
    variants: {
      size: {
        sm: "w-9 h-8 text-xs",
        md: "w-14 h-14 text-2xl",
        lg: "w-16 h-16 text-2xl",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

interface Props extends VariantProps<typeof workspaceCardVariants> {
  isLogo: boolean;
  logo?: string;
  name: string;
  className?: string;
}

export function WorkspaceSmallCard({ isLogo, logo = "", name, size, className }: Props) {
  return (
    <div className={`${cn(workspaceCardVariants({ size }), className)} relative ` }>
      {isLogo ? (
        <Image
          src={logo}
          alt={name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-[#1db954] flex items-center justify-center text-black font-bold">
          {name.trim()[0]?.toUpperCase() ?? ""}
        </div>
      )}
    </div>
  );
}