var ProfileDAO = require("../data/profile-dao").ProfileDAO;

/* The ProfileHandler must be constructed with a connected db */
function ProfileHandler(db) {
    "use strict";

    var profile = new ProfileDAO(db);
    var crypto = require('crypto');

    function decrypt(encrypted){
        // console.log(encrypted)
        // console.log("&&&&&&")
        var decipher = crypto.createCipher('aes192', 'a password');
        var decrypted = decipher.update(encrypted, 'hex', 'utf8');
        console.log(decrypted)

        decrypted += decipher.final('utf8');
        
        return decrypted;
        //return encrypted
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
                console.log(user)

                return res.render("profile", user);
            }
        );

    };

}

module.exports = ProfileHandler;
