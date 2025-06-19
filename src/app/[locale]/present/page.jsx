export default function PresentPage() {
    return (
        <div>
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: 0,
                    paddingTop: "56.25%",
                    paddingBottom: 0,
                    boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
                    overflow: "hidden",
                    borderRadius: "8px",
                    willChange: "transform",
                }}
            >
                <iframe
                    loading="lazy"
                    style={{
                        position: "absolute",
                        width: "100vw",
                        height: "100vh",
                        top: 0,
                        left: 0,
                        border: "none",
                        padding: 0,
                        margin: 0,
                    }}
                    src="https://www.canva.com/design/DAGp93urfsQ/GaMVkehUJds5FT2gGXHi3Q/view?embed"
                    allowFullScreen
                    allow="fullscreen"
                    title="Canva Presentation"
                ></iframe>
            </div>
            <a
                href="https://www.canva.com/design/DAGp93urfsQ/GaMVkehUJds5FT2gGXHi3Q/view?utm_content=DAGp93urfsQ&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                target="_blank"
                rel="noopener"
            >
            </a>{" "}
        </div>
    );
}