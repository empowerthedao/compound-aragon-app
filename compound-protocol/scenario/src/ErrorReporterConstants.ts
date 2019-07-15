
interface ErrorReporterEnum {
  Error: string[]
  FailureInfo: string[]
}

interface ErrorTypes {
  Error: {[name: string]: number}
  FailureInfo: {[name: string]: number}
  ErrorInv: {[code: number]: string}
  FailureInfoInv: {[code: number]: string}
}

const ComptrollerErrorReporter = {
  Error: [
    'NO_ERROR',
    'UNAUTHORIZED',
    'COMPTROLLER_MISMATCH',
    'INSUFFICIENT_SHORTFALL',
    'INSUFFICIENT_LIQUIDITY',
    'INVALID_CLOSE_FACTOR',
    'INVALID_COLLATERAL_FACTOR',
    'INVALID_LIQUIDATION_INCENTIVE',
    'MARKET_NOT_ENTERED',
    'MARKET_NOT_LISTED',
    'MARKET_ALREADY_LISTED',
    'MATH_ERROR',
    'NONZERO_BORROW_BALANCE',
    'PRICE_ERROR',
    'REJECTION',
    'SNAPSHOT_ERROR',
    'TOO_MANY_ASSETS',
    'TOO_MUCH_REPAY'
  ],

  FailureInfo: [
    'ACCEPT_ADMIN_PENDING_ADMIN_CHECK',
    'ACCEPT_PENDING_IMPLEMENTATION_ADDRESS_CHECK',
    'EXIT_MARKET_BALANCE_OWED',
    'EXIT_MARKET_REJECTION',
    'SET_CLOSE_FACTOR_OWNER_CHECK',
    'SET_CLOSE_FACTOR_VALIDATION',
    'SET_COLLATERAL_FACTOR_OWNER_CHECK',
    'SET_COLLATERAL_FACTOR_NO_EXISTS',
    'SET_COLLATERAL_FACTOR_VALIDATION',
    'SET_COLLATERAL_FACTOR_WITHOUT_PRICE',
    'SET_IMPLEMENTATION_OWNER_CHECK',
    'SET_LIQUIDATION_INCENTIVE_OWNER_CHECK',
    'SET_LIQUIDATION_INCENTIVE_VALIDATION',
    'SET_MAX_ASSETS_OWNER_CHECK',
    'SET_PENDING_ADMIN_OWNER_CHECK',
    'SET_PENDING_IMPLEMENTATION_OWNER_CHECK',
    'SET_PRICE_ORACLE_OWNER_CHECK',
    'SUPPORT_MARKET_EXISTS',
    'SUPPORT_MARKET_OWNER_CHECK',
    'ZUNUSED'
  ]
};

const TokenErrorReporter = {
  Error: [
    'NO_ERROR',
    'UNAUTHORIZED',
    'BAD_INPUT',
    'COMPTROLLER_REJECTION',
    'COMPTROLLER_CALCULATION_ERROR',
    'INTEREST_RATE_MODEL_ERROR',
    'INVALID_ACCOUNT_PAIR',
    'INVALID_CLOSE_AMOUNT_REQUESTED',
    'INVALID_COLLATERAL_FACTOR',
    'MATH_ERROR',
    'MARKET_NOT_FRESH',
    'MARKET_NOT_LISTED',
    'TOKEN_INSUFFICIENT_ALLOWANCE',
    'TOKEN_INSUFFICIENT_BALANCE',
    'TOKEN_INSUFFICIENT_CASH',
    'TOKEN_TRANSFER_IN_FAILED',
    'TOKEN_TRANSFER_OUT_FAILED'
  ],

  FailureInfo: [
    'ACCEPT_ADMIN_PENDING_ADMIN_CHECK',
    'ACCRUE_INTEREST_ACCUMULATED_INTEREST_CALCULATION_FAILED',
    'ACCRUE_INTEREST_BORROW_RATE_CALCULATION_FAILED',
    'ACCRUE_INTEREST_NEW_BORROW_INDEX_CALCULATION_FAILED',
    'ACCRUE_INTEREST_NEW_TOTAL_BORROWS_CALCULATION_FAILED',
    'ACCRUE_INTEREST_NEW_TOTAL_RESERVES_CALCULATION_FAILED',
    'ACCRUE_INTEREST_SIMPLE_INTEREST_FACTOR_CALCULATION_FAILED',
    'BORROW_ACCUMULATED_BALANCE_CALCULATION_FAILED',
    'BORROW_ACCRUE_INTEREST_FAILED',
    'BORROW_CASH_NOT_AVAILABLE',
    'BORROW_FRESHNESS_CHECK',
    'BORROW_NEW_TOTAL_BALANCE_CALCULATION_FAILED',
    'BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED',
    'BORROW_MARKET_NOT_LISTED',
    'BORROW_COMPTROLLER_REJECTION',
    'LIQUIDATE_ACCRUE_BORROW_INTEREST_FAILED',
    'LIQUIDATE_ACCRUE_COLLATERAL_INTEREST_FAILED',
    'LIQUIDATE_COLLATERAL_FRESHNESS_CHECK',
    'LIQUIDATE_COMPTROLLER_REJECTION',
    'LIQUIDATE_COMPTROLLER_CALCULATE_AMOUNT_SEIZE_FAILED',
    'LIQUIDATE_CLOSE_AMOUNT_IS_UINT_MAX',
    'LIQUIDATE_CLOSE_AMOUNT_IS_ZERO',
    'LIQUIDATE_FRESHNESS_CHECK',
    'LIQUIDATE_LIQUIDATOR_IS_BORROWER',
    'LIQUIDATE_REPAY_BORROW_FRESH_FAILED',
    'LIQUIDATE_SEIZE_BALANCE_INCREMENT_FAILED',
    'LIQUIDATE_SEIZE_BALANCE_DECREMENT_FAILED',
    'LIQUIDATE_SEIZE_COMPTROLLER_REJECTION',
    'LIQUIDATE_SEIZE_LIQUIDATOR_IS_BORROWER',
    'LIQUIDATE_SEIZE_TOO_MUCH',
    'MINT_ACCRUE_INTEREST_FAILED',
    'MINT_COMPTROLLER_REJECTION',
    'MINT_EXCHANGE_CALCULATION_FAILED',
    'MINT_EXCHANGE_RATE_READ_FAILED',
    'MINT_FRESHNESS_CHECK',
    'MINT_NEW_ACCOUNT_BALANCE_CALCULATION_FAILED',
    'MINT_NEW_TOTAL_SUPPLY_CALCULATION_FAILED',
    'MINT_TRANSFER_IN_FAILED',
    'MINT_TRANSFER_IN_NOT_POSSIBLE',
    'REDEEM_ACCRUE_INTEREST_FAILED',
    'REDEEM_COMPTROLLER_REJECTION',
    'REDEEM_EXCHANGE_TOKENS_CALCULATION_FAILED',
    'REDEEM_EXCHANGE_AMOUNT_CALCULATION_FAILED',
    'REDEEM_EXCHANGE_RATE_READ_FAILED',
    'REDEEM_FRESHNESS_CHECK',
    'REDEEM_NEW_ACCOUNT_BALANCE_CALCULATION_FAILED',
    'REDEEM_NEW_TOTAL_SUPPLY_CALCULATION_FAILED',
    'REDEEM_TRANSFER_OUT_NOT_POSSIBLE',
    'REDUCE_RESERVES_ACCRUE_INTEREST_FAILED',
    'REDUCE_RESERVES_ADMIN_CHECK',
    'REDUCE_RESERVES_CASH_NOT_AVAILABLE',
    'REDUCE_RESERVES_FRESH_CHECK',
    'REDUCE_RESERVES_VALIDATION',
    'REPAY_BEHALF_ACCRUE_INTEREST_FAILED',
    'REPAY_BORROW_ACCRUE_INTEREST_FAILED',
    'REPAY_BORROW_ACCUMULATED_BALANCE_CALCULATION_FAILED',
    'REPAY_BORROW_COMPTROLLER_REJECTION',
    'REPAY_BORROW_FRESHNESS_CHECK',
    'REPAY_BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED',
    'REPAY_BORROW_NEW_TOTAL_BALANCE_CALCULATION_FAILED',
    'REPAY_BORROW_TRANSFER_IN_NOT_POSSIBLE',
    'SET_COLLATERAL_FACTOR_OWNER_CHECK',
    'SET_COLLATERAL_FACTOR_VALIDATION',
    'SET_COMPTROLLER_OWNER_CHECK',
    'SET_INTEREST_RATE_MODEL_ACCRUE_INTEREST_FAILED',
    'SET_INTEREST_RATE_MODEL_FRESH_CHECK',
    'SET_INTEREST_RATE_MODEL_OWNER_CHECK',
    'SET_MAX_ASSETS_OWNER_CHECK',
    'SET_ORACLE_MARKET_NOT_LISTED',
    'SET_PENDING_ADMIN_OWNER_CHECK',
    'SET_RESERVE_FACTOR_ACCRUE_INTEREST_FAILED',
    'SET_RESERVE_FACTOR_ADMIN_CHECK',
    'SET_RESERVE_FACTOR_FRESH_CHECK',
    'SET_RESERVE_FACTOR_BOUNDS_CHECK',
    'TRANSFER_COMPTROLLER_REJECTION',
    'TRANSFER_NOT_ALLOWED',
    'TRANSFER_NOT_ENOUGH',
    'TRANSFER_TOO_MUCH'
  ]
};

function parseEnum(reporterEnum: ErrorReporterEnum): ErrorTypes {
  const Error: {[name: string]: number} = {};
  const ErrorInv: {[code: number]: string} = {};
  const FailureInfo: {[name: string]: number} = {};
  const FailureInfoInv: {[code: number]: string} = {};

  reporterEnum.Error.forEach((entry, i) => {
    Error[entry] = i;
    ErrorInv[i] = entry;
  });

  reporterEnum.FailureInfo.forEach((entry, i) => {
    FailureInfo[entry] = i;
    FailureInfoInv[i] = entry;
  });

  return {Error, ErrorInv, FailureInfo, FailureInfoInv};
}

export const ComptrollerErr = parseEnum(ComptrollerErrorReporter);
export const TokenErr = parseEnum(TokenErrorReporter);
