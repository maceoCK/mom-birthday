import Canvas from "./Canvas";
import flowers from "./assets/flowers.png";
import Button from "@mui/material/Button";
import { useEffect } from "react";

function App() {
    useEffect(() => {
        if (window.innerWidth < 768) {
            alert("This website is best viewed on a desktop for the best experience.");
        }
    }, []);

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${flowers})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: "-1",
                }}
            />
            <Canvas />
            <div
                className="birthdaymessage"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    color: "black",
                }}
            >
                <h1 style={{ color: "black" }}>Happy Birthday Mom!</h1>
                <p>
                    I am disapointed I am not able to be in new york for your
                    birthday, but I hope you have a greate day and a great year
                    ahead.
                </p>
                <p>
                    I look forward to being back in New York to see and talk
                    with you.
                </p>
                <p>
                    I wanted to make a website to celebrate your birthday, and
                    show what I have been learning in school and my internship!
                </p>
                <p>Love, Maceo</p>
                <Button
                    variant="contained"
                    color="primary"
                    style={{
                        marginTop: "20px",
                        backgroundColor: "#8070CF",
                        color: "white",
                    }}
                    href="https://github.com/maceoCK/birthday-website"
                    target="_blank"
                >
                    Check out the code for this
                </Button>
            </div>
        </>
    );
}

export default App;
