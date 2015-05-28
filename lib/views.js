exports.dtfcdocs = {
    map: function(doc) {
        if (doc.dtfc) {
            emit(doc._id, null);
        }
    }
};
