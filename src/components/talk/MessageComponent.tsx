import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { RiSendPlane2Fill } from "react-icons/ri";
import { ImSpinner2 } from "react-icons/im";

interface FormState {
    email: string;
    message: string;
}

const MessageComponent = () => {
    const [formState, setFormState] = useState<FormState>({ email: "", message: "" });
    const [status, setStatus] = useState({ sending: false, error: "", sent: false });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const sendMessage = async () => {
        const { email, message } = formState;
    
        if (!email || !message) {
            setStatus(prev => ({ ...prev, error: "Please fill out all fields!" }));
            return;
        }
    
        if (!emailRegex.test(email)) {
            setStatus(prev => ({ ...prev, error: "Please enter a valid email address." }));
            return;
        }
    
        setStatus({ sending: true, error: "", sent: false });
    
        try {
            const response = await axios.post("/api/send", { email, message });
            
            if (response.data.result === "Success") {
                setStatus({ sending: false, error: "", sent: true });
                return;
            }
            
            setStatus({ 
                sending: false, 
                error: `Error: ${response.data.result}`, 
                sent: false 
            });
        } catch (error) {
            setStatus({ 
                sending: false, 
                error: "Failed to send message. Please try again.", 
                sent: false 
            });
        }
    };

    const inputClasses = `
    w-full p-3 rounded-xl text-sm transition-all duration-200
    bg-slate-200/50 dark:bg-slate-200/5 
    border border-transparent focus:border-violet-500
    focus:outline-none focus:ring-2 focus:ring-violet-500/20
    placeholder:text-gray-500/60 dark:placeholder:text-slate-200/20
  `;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 h-auto min-h-[21.5rem] bg-white/50 dark:bg-white/5 
                 rounded-xl p-6 border border-zinc-800/10 shadow-lg shadow-black/5"
        >
            <AnimatePresence mode="wait">
                {status.sent ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center space-y-4"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-16 h-16 bg-violet-500 rounded-full flex items-center justify-center"
                        >
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </motion.div>
                        <p className="text-gray-600 dark:text-gray-300 text-center">
                            Thanks for reaching out! I'll get back to you soon.
                        </p>
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={e => {
                            e.preventDefault();
                            sendMessage();
                        }}
                        className="space-y-4"
                    >
                        <div className="space-y-1">
                            <label className="font-medium text-sm text-gray-900 dark:text-slate-400">EMAIL</label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                type="email"
                                placeholder="you@example.com"
                                value={formState.email}
                                onChange={e => {
                                    setFormState(prev => ({ ...prev, email: e.target.value }));
                                    setStatus(prev => ({ ...prev, error: "" }));
                                }}
                                className={inputClasses}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="font-medium text-sm text-gray-900 dark:text-slate-400">MESSAGE</label>
                            <motion.textarea
                                whileFocus={{ scale: 1.01 }}
                                placeholder="Hi Berry, let's collaborate!"
                                value={formState.message}
                                onChange={e => {
                                    setFormState(prev => ({ ...prev, message: e.target.value }));
                                    setStatus(prev => ({ ...prev, error: "" }));
                                }}
                                className={`${inputClasses} min-h-[9rem] resize-none`}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <AnimatePresence mode="wait">
                                {status.error && (
                                    <motion.p
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="text-red-500 text-sm"
                                    >
                                        {status.error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={status.sending}
                                className="bg-violet-500 hover:bg-violet-600 text-white
                         rounded-xl px-6 py-2.5 font-medium text-sm
                         transition-all duration-200 disabled:opacity-50
                         flex items-center space-x-2 shadow-lg shadow-violet-500/20"
                            >
                                <span>Send</span>
                                {status.sending ? (
                                    <ImSpinner2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <RiSendPlane2Fill className="w-4 h-4" />
                                )}
                            </motion.button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MessageComponent;
