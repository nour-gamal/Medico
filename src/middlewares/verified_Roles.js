const verifiedRoles = (allowedRoles) => {
    return (req, res, next) => {
        const AdminRole = req.user.role ? req.user.role : req.userType === 2 ? "Doctor" : "Patient";
        try {
            if (!AdminRole) {
                throw new Error('no role')
            }
            if (!allowedRoles.includes(AdminRole.toString())) {
                throw new Error(allowedRoles, AdminRole)
            }

            next();
        } catch (error) {
            res.status(401).send({ code: 401, message: error.message })
        }
    }
}
module.exports = verifiedRoles;