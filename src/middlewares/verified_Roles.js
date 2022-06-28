const verifiedRoles = (allowedRoles) => {
    return (req, res, next) => {
        const AdminRole = req.user.role ? req.user.role : req.userType === 2 ? "Doctor" : "Patient";
        try {
            console.log(req.user.role)
            console.log(AdminRole, allowedRoles)
            if (!AdminRole) {
                throw new Error()
            }
            if (!allowedRoles.includes(AdminRole.toString())) {
                throw new Error()
            }

            next();
        } catch (error) {
            res.status(401).send({ code: 401, message: 'You are not authorized to perform this action!' })
        }
    }
}
module.exports = verifiedRoles;