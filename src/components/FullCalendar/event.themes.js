const themes = {
  blue: {
    backgroundColor: "#E7F5FA",
    textColor: "#00425E",
    borderColor: "#B9E1F1"
  },
  green: {
    backgroundColor: "#D9EBE4",
    textColor: "#0E291F",
    borderColor: "#B4D7CA"
  },
  purple: {
    backgroundColor: "#EBDAE8",
    textColor: "#371330",
    borderColor: "#D8B5D2"
  },
  gray: {
    backgroundColor: "#F9F9F9",
    textColor: "#545454",
    borderColor: "#E6E6E6"
  },
  yellow: {
    backgroundColor: "#FFF3D0",
    textColor: "#8C6900",
    borderColor: "#CDCDCD"
  },
  red: {
    backgroundColor: "#F7D2D0",
    textColor: "#4F0400",
    borderColor: "#F0A6A2"
  },
  darkpurple: {
    backgroundColor: "#963484",
    textColor: "#F5ECF3",
    borderColor: "#7B2B6D"
  },
  darkblue: {
    backgroundColor: "#0091CE",
    textColor: "#E7F5FA",
    borderColor: "#A2D7ED"
  },
  darkgreen: {
    backgroundColor: "#32936F",
    textColor: "#D9EBE4",
    borderColor: "#B4D7CA"
  },
};

export default function theme(color) {
  color = color.replace(" ", "");
  return themes[color];
}
