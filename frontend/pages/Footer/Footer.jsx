import { useRouter } from "next/router";

const Footer = () => {
    const router = useRouter();
    const id = 16;

    return (
        <footer>
            <div id="footer-content">
                <div className="buttons">
                    <button
                        className="button"
                        onClick={() => router.push('/1')}
                    >
                        Home
                    </button>
                    <button
                        className="button"
                        onClick={() => router.push(`/user/${id}`)}
                    >
                        Profile
                    </button>
                </div>
                <div className="buttons social">
                    <button
                        className="button"
                        onClick={() => window.open('https://github.com/FPyMEHTAPIU', '_blank')}
                    >
                        <img src="/github.svg" alt="GitHub"/>
                    </button>
                    <button
                        className="button"
                        onClick={() => window.open('https://www.linkedin.com/in/mykolasaveliev/', '_blank')}
                    >
                        <img src="/linkedin.svg" alt="LinkedIn"/>
                    </button>
                    <button
                        className="button"
                        onClick={() => window.open('mailto:kolya59264@gmail.com', '_blank')}
                    >
                        <img src="/gmail.svg" alt="Gmail"/>
                    </button>
                </div>
            </div>
            <div id="credits">
                Nick Saveliev, 2024
            </div>
        </footer>
    )
};

export default Footer;
