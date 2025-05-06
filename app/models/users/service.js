var userObj = require('./users.js');

/*** save job service ***/
exports.signup = function(paramData, callback) {
    userObj(paramData).save(function(err, data) {
        callback(err, data)
    });
}


exports.userlist = function(callback) {
    userObj.find({ is_deleted: false }, function(err, data) {
        callback(err, data)
    });
}

exports.finduserById = function(id, callback) {
    userObj.findById(id).populate('interest skills jobseeker_qualification').exec(function(err, data) {
        callback(err, data)
    });

}

exports.updateUser = function(data1, callback) {
    var query = data1;
    var userId = data1.id;
    userObj.findOneAndUpdate({ _id: userId, "is_deleted": false }, query, { "new": true }, function(err, data) {
        callback(err, data)
    });
}

exports.updateSetting = function(inputJson, callback) {
    var query = inputJson;
    var userId = inputJson.userId;
    delete query._id;
    userObj.findOneAndUpdate({ _id: userId, "is_deleted": false }, query, { "new": true }, function(err, data) {
        callback(err, data)
    });
}

/* start added by madhuri*/
exports.userlistforadmin = function(data, callback) {
    var limit = data.count ? data.count : {};
    var role = data.role;
    var sortby = data.sortby ? data.sortby : {};
    var skip = data.count && data.page ? (data.count) * (data.page - 1) : {};
    if (role && role != undefined) {
        var query = { is_deleted: false, role: role };
    } else {
        var query = { is_deleted: false };

    }
    data.keyword = data.keyword ? data.keyword.toLowerCase() : "";

    if ((data.keyword == 'female')) {
        var gender = 2;
    } else if ((data.keyword == 'male')) {
        var gender = 1;
    }

    if (data.keyword && data.keyword != undefined) {
        query['$or'] = [{ firstname: { $regex: data.keyword, $options: "$i" } }, { lastname: { $regex: data.keyword, $options: "$i" } }, { address: { $regex: data.keyword, $options: "$i" } }, { mobile_no: { $regex: data.keyword, $options: "$i" } }, { email: { $regex: data.keyword, $options: "$i" } }];
    }
    if (gender)
        query['$or'].push({ gender: gender });

    userObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)

    .exec(function(err, data) {
        if (data) {
            userObj.count(query, function(err, count) {
                callback(err, data, count);

            })

        }


    });


}


exports.deleteUser = function(data, callback) {
    var userid = data.userid ? data.userid : {};
    userObj.update({ _id: userid }, { $set: { is_deleted: true } }, function(err, update) {
        if (update) {
            callback(err, update);
        }
    })
}

exports.inactiveUser = function(data, callback) {
    var userid = data.userid ? data.userid : {};
    userObj.update({ _id: userid }, { $set: { is_active: false } }, function(err, update) {
        if (update) {
            callback(err, update);
        }
    })

}
exports.activeUser = function(data, callback) {
    var userid = data.userid ? data.userid : {};
    userObj.update({ _id: userid }, { $set: { is_active: true } }, function(err, update) {
        if (update) {
            callback(err, update);
        }
    })
}
exports.addUserData = function(data, callback) {
    data.password = new Buffer(data.password).toString('base64');
    data.role = data.role == "Employer" ? 1 : 2;
    userObj(data).save(function(err, data) {
        callback(err, data);
    });
}

exports.getuserdetails = function(data, callback) {
    var userid = data.userid ? data.userid : {};
    userObj.findOne({ _id: userid }, function(err, user) {
        callback(err, user);
    })
}
exports.updateUserData = function(data, callback) {
    var userid = data._id ? data._id : {};
    data.role = data.role == "Employer" ? 1 : 2;
    // data.password = new Buffer(data.password).toString('base64');
    delete data._id;
    userObj.update({ _id: userid }, { $set: data }, function(err, update) {
        if (update) {
            callback(err, update);
        }

    })
}



/* end */


exports.getUserCounts = function(callback) {
    var queryEmployer = { is_deleted: false, role: 1 };
    var queryJobSeeker = { is_deleted: false, role: 2 };
    userObj.count(queryEmployer, function(err, employeeCount) {
        employeeCount = employeeCount || 0;
        userObj.count(queryJobSeeker, function(err, jobSeekerCount) {
            jobSeekerCount = jobSeekerCount || 0;
            totalCount = employeeCount + jobSeekerCount;
            callback({ employee: employeeCount, jobSeeker: jobSeekerCount, total: totalCount });
        })
    })
}

// check user vaild or not at edit user page

exports.checkVaildUser = function(data, callback) {
    var userid = data ? data.userId : {};
    userObj.count({ _id: userid, is_deleted: false }, function(err, user) {
        callback(err, user);
    })
}

exports.changepassword = function(id, data, callback) {
    var userid = id;
    var newPassword = new Buffer(data.newPassword).toString('base64')
    userObj.update({ _id: userid }, { $set: { 'password': newPassword } },
        function(err, update) {
            callback(err, update)
        })
}


exports.userStats= function(startdate,enddate,callback){
    console.log("startdate",startdate);
    console.log("enddate",enddate);
    var query={is_deleted: false};
    if(startdate&&enddate){
        var Sd = new Date(startdate);
        var Ed = new Date(enddate);
        query["createdDate"]={$gte: Sd,$lt:Ed };
    }
    console.log("query",query);
    userObj.find(query).exec(function(err,users){
        console.log("errrr111111",err);
        console.log("errrr111111",users);
        callback(err,users);
    })
}

// exports.getActiveUser = function(callback) {
//     query = { 'is_active': true, "is_deleted": false };
//     userObj.find(query).count(function(err, data) {
//         callback(err, data)
//         console.log("data",data);
//     });
// }