
import { useTheme } from "@/components/ThemeProvider";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#0c120e]/95 group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-white/15 group-[.toaster]:backdrop-blur-2xl group-[.toaster]:shadow-[0_12px_40px_rgba(0,0,0,0.8)] group-[.toaster]:rounded-2xl group-[.toaster]:p-4",
          description: "group-[.toast]:text-white/70 group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-[#2DD4BF] group-[.toast]:to-[#10B981] group-[.toast]:text-black group-[.toast]:font-bold group-[.toast]:rounded-xl",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white group-[.toast]:rounded-xl",
          closeButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white/80 group-[.toast]:border group-[.toast]:border-white/20 hover:group-[.toast]:bg-white/20",
          success: "group-[.toaster]:border-[#2DD4BF]/40 group-[.toaster]:shadow-[0_0_30px_rgba(45,212,191,0.25)]",
          error: "group-[.toaster]:border-rose-500/40 group-[.toaster]:shadow-[0_0_30px_rgba(244,63,94,0.25)]",
          warning: "group-[.toaster]:border-amber-500/40 group-[.toaster]:shadow-[0_0_30px_rgba(245,158,11,0.25)]",
          info: "group-[.toaster]:border-cyan-500/40 group-[.toaster]:shadow-[0_0_30px_rgba(6,182,212,0.25)]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

