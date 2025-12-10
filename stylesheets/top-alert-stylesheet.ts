import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  alertBase: {
    position: "absolute",
    top: 65,
    left: 0,
    right: 0,
    marginHorizontal: "5%",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    padding: 14,
    flexDirection: "row",
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 9999,
    alignItems: "center",
  },


  alertSuccess: {
    backgroundColor: "#4CAF50",
  },
  alertSuccessText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 10,
    fontSize: 14,
    textAlign: "center",
  },
  alertError: {
     backgroundColor: "#FF5252",
  },
  alertErrorText: {
    color:"#fff",
    fontWeight: "600",
    marginLeft: 10,
    fontSize: 14,
    textAlign: "center",
  },
});

export default styles;
