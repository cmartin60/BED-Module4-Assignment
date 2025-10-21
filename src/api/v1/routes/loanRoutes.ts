import express, { Router } from "express";
import * as loanController from "../controllers/loanController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { AuthorizationOptions } from "../models/authorizationOptions";

const router: Router = express.Router();

// "/api/v1/loans" prefixes all below routes
router.get("/", loanController.getAllLoans);

// create: user is expected to be authenticated/authorized (example uses admin/manager)
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["user"] } as AuthorizationOptions),
    loanController.createLoan
);

// update: admin/manager or same user allowed
router.put(
    "/:id",
    authenticate,
    isAuthorized({
        hasRole: ["admin", "manager"],
        allowSameUser: true,
    } as AuthorizationOptions),
    loanController.updateLoan
);


router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "manager"] } as AuthorizationOptions),
    loanController.deleteLoan
);

// review: officer role
router.put(
    "/:id/review",
    authenticate,
    isAuthorized({ hasRole: ["officer"] } as AuthorizationOptions),
    loanController.reviewLoan
);

// approve: manager role
router.put(
    "/:id/approve",
    authenticate,
    isAuthorized({ hasRole: ["manager"] } as AuthorizationOptions),
    loanController.approveLoan
);

// get by id (auth protected as example: admin or same user)
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"], allowSameUser: true } as AuthorizationOptions),
    loanController.getLoanById
);

export default router;
