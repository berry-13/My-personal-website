import MessageForm from "~/components/MessageForm";
import Reveal from "~/components/motion/Reveal";

const Contact = () => (
    <>
        <Reveal>
            <h1 className="text-[clamp(2.6rem,7.2vw,6.75rem)] leading-[1.02] tracking-[-0.025em]">Let&apos;s talk</h1>
        </Reveal>
        <div className="mt-16 grid gap-y-16 lg:mt-24 lg:grid-cols-12 lg:gap-x-10">
            <Reveal index={1} className="lg:col-span-5">
                <p className="max-w-[30rem] text-lg leading-relaxed text-ink/85 lg:text-xl lg:leading-relaxed">
                    Questions, collaborations, or something you&apos;d like built. Leave a message, or reach me
                    directly.
                </p>
                <dl className="mt-10 space-y-5 font-mono text-[13px]">
                    <div>
                        <dt className="text-muted">discord</dt>
                        <dd className="mt-1 text-lg">
                            <a
                                href="https://discord.com/users/777604723435896843"
                                target="_blank"
                                rel="noreferrer"
                                className="link font-serif"
                            >
                                @berry_13
                            </a>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-muted">email</dt>
                        <dd className="mt-1 text-lg">
                            <a href="mailto:berry@librechat.ai" className="link font-serif">
                                berry@librechat.ai
                            </a>
                        </dd>
                    </div>
                </dl>
            </Reveal>
            <Reveal index={2} className="lg:col-span-6 lg:col-start-7">
                <MessageForm />
            </Reveal>
        </div>
    </>
);

export default Contact;
