
export class ComponentBase {
    showErrors(err: any){
        console.log(err);
        let message = "";
        if (err.status == "403") {
            message = "Login necessary";
        }
        else {
            message = "Error retrieving user customer accounts";
        }
        alert(message);
    }
}