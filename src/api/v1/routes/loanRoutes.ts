import express, { Router } from "express";
import * as loanController from "../controllers/loanController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { AuthorizationOptions } from "../models/authorizationOptions";

const router: Router = express.Router();

// "/api/v1/loans" prefixes all below routes
router.get("/", loanController.getAllLoans);

// create: user
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["user"] } as AuthorizationOptions),
    loanController.createLoan
);

// PUT update
router.put(
    "/:id",
    authenticate,
    loanController.updateLoan
);

// DELETE loans
router.delete(
    "/:id",
    authenticate,
    loanController.deleteLoan
);

// :id/review: officer role
router.put(
    "/:id/review",
    authenticate,
    isAuthorized({ hasRole: ["officer"], allowSameUser: true } as AuthorizationOptions),
    loanController.reviewLoan
);

// :id/approve: manager role
router.put(
    "/:id/approve",
    authenticate,
    isAuthorized({ hasRole: ["manager"] } as AuthorizationOptions),
    loanController.approveLoan
);

// Get loans
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["manager", "officer"], allowSameUser: true } as AuthorizationOptions),
    loanController.getLoanById
);

export default router;
