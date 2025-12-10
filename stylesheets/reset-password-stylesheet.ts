import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
},
signInTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 40,
},
emailTextInput: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
},
passwordContainer: {
   width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    color: '#fff',
    flexDirection: "row",
    justifyContent: "space-between"
},
passwordTextInput: {
    color: "#fff",
    fontSize: 16,
},
signUpBtn: {
    width: '100%',
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15
},
signUpText: {
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600'
},
androidPasswordContainer: {
   width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: '#fff',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
},
signInText: {
    color: "#4A90E2",
    fontSize: 16, 
    textDecorationLine: "underline"
},
signInContainer: {
    marginVertical: 20,
    justifyContent: "flex-start",
    marginRight: "auto",
    marginTop: 30
},
activityContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20
},
loadingText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#fff"
}
})

export default styles;