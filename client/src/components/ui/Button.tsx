import { Tooltip } from "react-tippy";
import { motion, type Variants } from "framer-motion";

// Type assertion for react-tippy which has incorrect types
const TooltipWrapper = Tooltip as unknown as React.FC<{
    title: string;
    position?: string;
    animation?: string;
    children: React.ReactNode;
}>;

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
            <TooltipWrapper title={title} position="bottom" animation="scale">
                {content}
            </TooltipWrapper>
        );
    }

    return content;
};

export default Button;
