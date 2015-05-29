exports.dtfcdocs = {
    map: function(doc) {
        if (doc.dtfc) {
            emit(doc._id, null);
        }
    }
};

exports.tag = {
    map: function(doc) {
        if (doc.dtfc && doc.tags) {
            doc.tags.forEach(function(tag) {
                emit(tag, null);
            });
        }
    }
};
