const quotes = [
    'Made by alex*',
    'never miss another pumpkin contest',
    'made with the tears of M7 completionists',
    'this bot cost me 0 booster cookies to make',
    'i was not made by KartoffelChips',
    'ill consider a jerry update',
    'add more quotes to the footer.ts file'
];

export const getRandomFooter = () => {
    return quotes[Math.floor(Math.random() * quotes.length)];
};
