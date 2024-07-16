import React, { useEffect, useRef } from "react";

const Canvas: React.FC = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mp = 150; // max particles
    let particles: any[] = [];
    let angle = 0;
    let tiltAngle = 0;
    let confettiActive = true;
    let animationComplete = true;
    let animationHandler: number;
    let W: number, H: number, ctx: CanvasRenderingContext2D | null;

    const particleColors = {
        colorOptions: [
            "DodgerBlue",
            "OliveDrab",
            "Gold",
            "pink",
            "SlateBlue",
            "lightblue",
            "Violet",
            "PaleGreen",
            "SteelBlue",
            "SandyBrown",
            "Chocolate",
            "Crimson",
        ],
        colorIndex: 0,
        colorIncrementer: 0,
        colorThreshold: 10,
        getColor: function () {
            if (this.colorIncrementer >= 10) {
                this.colorIncrementer = 0;
                this.colorIndex++;
                if (this.colorIndex >= this.colorOptions.length) {
                    this.colorIndex = 0;
                }
            }
            this.colorIncrementer++;
            return this.colorOptions[this.colorIndex];
        },
    };

    class ConfettiParticle {
        x: number;
        y: number;
        r: number;
        d: number;
        color: string;
        tilt: number;
        tiltAngleIncremental: number;
        tiltAngle: number;

        constructor(color: string) {
            this.x = Math.random() * W;
            this.y = Math.random() * H - H;
            this.r = RandomFromTo(10, 30);
            this.d = Math.random() * mp + 10;
            this.color = color;
            this.tilt = Math.floor(Math.random() * 10) - 10;
            this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
            this.tiltAngle = 0;
        }

        draw() {
            if (!ctx) return;
            ctx.beginPath();
            ctx.lineWidth = this.r / 2;
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
            ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
            ctx.stroke();
        }
    }

    const RandomFromTo = (from: number, to: number) => {
        return Math.floor(Math.random() * (to - from + 1) + from);
    };

    const InitializeConfetti = () => {
        particles = [];

        animationComplete = false;
        for (let i = 0; i < mp; i++) {
            const particleColor = particleColors.getColor();
            particles.push(new ConfettiParticle(particleColor));
        }
        StartConfetti();
    };

    const Draw = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);
        ctx.font = "48px Arial";
        particles.forEach((particle) => particle.draw());
        Update();
    };

    const Update = () => {
        let remainingFlakes = 0;
        angle += 0.01;
        tiltAngle += 0.1;

        particles.forEach((particle, i) => {
            if (animationComplete) return;

            if (!confettiActive && particle.y < -15) {
                particle.y = H + 100;
                return;
            }

            stepParticle(particle, i);

            if (particle.y <= H) {
                remainingFlakes++;
            }
            CheckForReposition(particle, i);
        });

        if (remainingFlakes === 0) {
            StopConfetti();
        }
    };

    const stepParticle = (
        particle: ConfettiParticle,
        particleIndex: number
    ) => {
        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 2;
        particle.x += Math.sin(angle);
        particle.tilt = Math.sin(particle.tiltAngle - particleIndex / 3) * 15;
    };

    const CheckForReposition = (particle: ConfettiParticle, index: number) => {
        if (
            (particle.x > W + 20 || particle.x < -20 || particle.y > H) &&
            confettiActive
        ) {
            if (index % 5 > 0 || index % 2 === 0) {
                repositionParticle(
                    particle,
                    Math.random() * W,
                    -10,
                    Math.floor(Math.random() * 10) - 10
                );
            } else {
                if (Math.sin(angle) > 0) {
                    repositionParticle(
                        particle,
                        -5,
                        Math.random() * H,
                        Math.floor(Math.random() * 10) - 10
                    );
                } else {
                    repositionParticle(
                        particle,
                        W + 5,
                        Math.random() * H,
                        Math.floor(Math.random() * 10) - 10
                    );
                }
            }
        }
    };

    const repositionParticle = (
        particle: ConfettiParticle,
        xCoordinate: number,
        yCoordinate: number,
        tilt: number
    ) => {
        particle.x = xCoordinate;
        particle.y = yCoordinate;
        particle.tilt = tilt;
    };

    const StartConfetti = () => {
        W = window.innerWidth;
        H = window.innerHeight;
        if (canvasRef.current) {
            canvasRef.current.width = W;
            canvasRef.current.height = H;
        }
        (function animloop() {
            if (animationComplete) return;
            animationHandler = requestAnimationFrame(animloop);
            Draw();
        })();
    };

    const StopConfetti = () => {
        animationComplete = true;
        if (ctx) ctx.clearRect(0, 0, W, H);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            ctx = canvas.getContext("2d");
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
            InitializeConfetti();
        }

        window.addEventListener("resize", () => {
            W = window.innerWidth;
            H = window.innerHeight;
            if (canvas) {
                canvas.width = W;
                canvas.height = H;
            }
        });

        return () => {
            cancelAnimationFrame(animationHandler);
        };
    }, []);

    return (
        <>
            <canvas {...props} ref={canvasRef} style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100%" }} />
            <button
                onClick={() => {
                    confettiActive = !confettiActive;
                    if (confettiActive) {
                        InitializeConfetti();
                    } else {
                        StopConfetti(); // Stop the confetti when toggled off
                    }
                }}
                style={{
                    position: "fixed",
                    top: "80%",
                    left: "calc(50% - 100px)",
                    width: "200px",
                    height: "40px",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                }}
            >
                Toggle Confetti
            </button>
        </>
    );
};

export default Canvas;