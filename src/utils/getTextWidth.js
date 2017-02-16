const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

export default (text, font) => {
    context.font = font;
    return context.measureText(text).width;
};
