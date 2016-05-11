"use strict";
var ComponentBase = (function () {
    function ComponentBase() {
    }
    ComponentBase.prototype.errorClassToUse = function (form, inputName, isGroup) {
        if (isGroup === void 0) { isGroup = false; }
        if (isGroup) {
            return !form.valid && form.find(inputName).touched ? 'has-error' : '';
        }
        else {
            return !form.find(inputName).valid && form.find(inputName).touched ? 'has-error' : '';
        }
    };
    ComponentBase.prototype.showErrors = function (err, message) {
        if (message === void 0) { message = ''; }
        if (err.status == "403") {
            message = "Unauthorized access";
            localStorage.removeItem("id_token");
            alert(message);
            window.location.reload();
        }
        alert(message);
    };
    return ComponentBase;
}());
exports.ComponentBase = ComponentBase;
//# sourceMappingURL=component-base.js.map