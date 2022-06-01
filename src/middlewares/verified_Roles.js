const { getAdminRoleName } = require("../helpers/helpers");

const verifiedRoles = (allowedRoles) => {
    return (req, res, next) => {
        const AdminRole = req.user.role;
        try {
            if (!AdminRole) {
                throw new Error()
            }
            const adminRoleName = getAdminRoleName(AdminRole.toString())
            if (adminRoleName !== allowedRoles) {
                throw new Error()
            }
            next();

        } catch (error) {
            res.status(401).send({ code: 401, message: 'You are not authorized to perform this action!' })
        }
    }
}
module.exports = verifiedRoles;