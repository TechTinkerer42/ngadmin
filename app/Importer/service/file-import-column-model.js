"use strict";
var FileImportColumn = (function () {
    function FileImportColumn(ColumnName, IsValueColumn) {
        if (IsValueColumn === void 0) { IsValueColumn = false; }
        this.ColumnName = ColumnName;
        this.IsValueColumn = IsValueColumn;
        this.RenamedName = "";
    }
    return FileImportColumn;
}());
exports.FileImportColumn = FileImportColumn;
//# sourceMappingURL=file-import-column-model.js.map