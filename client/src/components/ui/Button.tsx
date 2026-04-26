import * as Tooltip from "@radix-ui/react-tooltip";
import { motion, type Variants } from "framer-motion";

export interface ButtonProps {
    title?: string;
    label?: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    variants?: Variants;
}

const defaultVariants: Variants = {
    hidden: { y: -20, opacity: 0, scale: 0.9 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const Button = ({ title, label, icon, href, onClick, disabled, variants = defaultVariants }: ButtonProps) => {
    const Component = href ? motion.a : motion.button;
    const linkProps = href
        ? { href, target: "_blank", rel: "noreferrer" }
        : { type: "button" as const, onClick, disabled };

    const content = (
        <Component
            {...linkProps}
            aria-label={title || label}
            variants={variants}
            whileHover={disabled ? undefined : { scale: 1.1 }}
            whileTap={disabled ? undefined : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className={`flex items-center gap-2 p-2.5 rounded-xl transition-colors duration-300 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            {icon}
            {label && <span className="text-sm font-medium">{label}</span>}
        </Component>
    );

    if (title) {
        return (
            <Tooltip.Root>
                <Tooltip.Trigger asChild>{content}</Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        side="bottom"
                        sideOffset={6}
                        className="z-[1000] rounded-md bg-black/90 dark:bg-white/90 px-2 py-1 text-xs text-white dark:text-black shadow-lg backdrop-blur-sm data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0"
                    >
                        {title}
                        <Tooltip.Arrow className="fill-black/90 dark:fill-white/90" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        );
    }

    return content;
};

export default Button;
