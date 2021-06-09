export const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export const COLORS = [
    "#fad390",
    "#f8c291",
    "#6a89cc",
    "#82ccdd",
    "#b8e994",
    "#f6b93b",
    "#e55039",
    "#4a69bd",
    "#60a3bc",
    "#78e08f",
    "#fa983a",
    "#eb2f06",
    "#1e3799",
    "#3c6382",
    "#38ada9",
    "#e58e26",
    "#b71540",
    "#0c2461",
    "#0a3d62",
    "#079992"
]

export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}