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
    backgroundColor: "#e6f9ed",
    borderColor: "#34a853",
  },
  alertSuccessText: {
    fontFamily: "RethinkSans-Medium",
    color: "#196f3d",
    fontSize: 14,
    textAlign: "center",
  },


  alertError: {
    backgroundColor: "#fdecea",
    borderColor: "#d93025",
  },
  alertErrorText: {
    fontFamily: "RethinkSans-Medium",
    color: "#b21f1f",
    fontSize: 14,
    textAlign: "center",
  },
});

export default styles;
