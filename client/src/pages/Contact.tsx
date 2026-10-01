import MessageForm from "~/components/MessageForm";

const Contact = () => (
    <>
        <h1 className="text-[clamp(1.6rem,4.2vw,2.35rem)] leading-tight">Let&apos;s talk</h1>
        <p className="mt-3 max-w-[34rem] text-[17px] leading-relaxed text-ink/85">
            Questions, collaborations, or something you&apos;d like built. Leave a message here, or reach me on{" "}
            <a
                href="https://discord.com/users/777604723435896843"
                target="_blank"
                rel="noreferrer"
                className="link"
            >
                Discord (@berry_13)
            </a>{" "}
            or at{" "}
            <a href="mailto:berry@librechat.ai" className="link">
                berry@librechat.ai
            </a>
            .
        </p>
        <MessageForm />
    </>
);

export default Contact;
