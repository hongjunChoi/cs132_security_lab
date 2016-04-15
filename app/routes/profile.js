var ProfileDAO = require("../data/profile-dao").ProfileDAO;

/* The ProfileHandler must be constructed with a connected db */
function ProfileHandler(db) {
    "use strict";

    var profile = new ProfileDAO(db);
    var crypto = require('crypto');

    function decrypt(encrypted){

        console.log("decrpting "+ encrypted);
        var decipher = crypto.createDecipher('aes192', 'a password');
        var decrypted = decipher.update(encrypted, 'hex', 'utf8');

        decrypted += decipher.final('utf8');
                console.log("result "+ decrypted);

        return decrypted
    }

    this.displayProfile = function(req, res, next) {
        var userId = req.session.userId;

        profile.getByUserId(parseInt(userId), function(err, doc) {
            if (err) return next(err);
            doc.userId = userId;

            return res.render("profile", doc);
        });
    };

    this.handleProfileUpdate = function(req, res, next) {

        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var ssn = req.body.ssn;
        var dob = req.body.dob;
        var address = req.body.address;
        var bankAcc = req.body.bankAcc;
        var bankRouting = req.body.bankRouting;

        var userId = req.session.userId;

        profile.updateUser(
            parseInt(userId),
            firstName,
            lastName,
            ssn,
            dob,
            address,
            bankAcc,
            bankRouting,
            function(err, user) {

                if (err) return next(err);

                // WARN: Applying any sting specific methods here w/o checking type of inputs could lead to DoS by HPP
                //firstName = firstName.trim();
                user.updateSuccess = true;
                user.userId = userId;
                if(user.firstName != "" && typeof user.firstName != "undefined"){
                     console.log("$$$$$$$$$$$$$$$");
                     console.log(user.firstName);
                    user.firstName = decrypt(user.firstName)

                }if(user.lastName != "" && typeof user.lastName != "undefined"){
                    console.log("$$$$$$$$$$$$$$$");
                    console.log(user.lastName);
                    user.lastName = decrypt(user.lastName)

                }if(user.bankRouting != "" && typeof user.bankRouting != "undefined"){
                     console.log("$$$$$$$$$$$$$$$");
                    console.log(user.bankRouting);
                    user.bankRouting = decrypt(user.bankRouting)

                }if(user.bankAcc != "" && typeof user.bankAcc != "undefined"){
                    console.log("$$$$$$$$$$$$$$$");
                    console.log(user.bankAcc);
                    user.bankAcc = decrypt(user.bankAcc)
                    
                }if(user.ssn != "" && typeof user.ssn != "undefined"){
                    console.log("$$$$$$$$$$$$$$$");
                    console.log(user.ssn);
                    user.ssn = decrypt(user.ssn)

                }if(user.dob != "" && typeof user.dob != "undefined"){
                    console.log("$$$$$$$$$$$$$$$");
                    console.log(user.dob);
                    user.dob = decrypt(user.dob)

                }if(user.address != "" && typeof user.address != "undefined"){
                    console.log("$$$$$$$$$$$$$$$");
                    console.log(user.address);
                    user.address = decrypt(user.address)
                }

                return res.render("profile", user);
            }
        );

    };

}

module.exports = ProfileHandler;
