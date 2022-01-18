import * as BufferLayout from '@solana/buffer-layout';

import {encodeData, decodeData, InstructionType} from './instruction';
import * as Layout from './layout';
import {PublicKey} from './publickey';
import {SystemProgram} from './system-program';
import {
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_STAKE_HISTORY_PUBKEY,
} from './sysvar';
import {Transaction, TransactionInstruction} from './transaction';
import {toBuffer} from './util/to-buffer';

/**
 * Address of the stake config account which configures the rate
 * of stake warmup and cooldown as well as the slashing penalty.
 */
export const ATTENTION_CONFIG_ID = new PublicKey(
  'Attention22222222222222222222222222222222222',
);

/**
//  * Stake account authority info
//  */
// export class Authorized {
//   /** stake authority */
//   staker: PublicKey;
//   /** withdraw authority */
//   withdrawer: PublicKey;

//   /**
//    * Create a new Authorized object
//    * @param staker the stake authority
//    * @param withdrawer the withdraw authority
//    */
//   constructor(staker: PublicKey, withdrawer: PublicKey) {
//     this.staker = staker;
//     this.withdrawer = withdrawer;
//   }
// }

// /**
//  * Stake account lockup info
//  */
// export class Lockup {
//   /** Unix timestamp of lockup expiration */
//   unixTimestamp: number;
//   /** Epoch of lockup expiration */
//   epoch: number;
//   /** Lockup custodian authority */
//   custodian: PublicKey;

//   /**
//    * Create a new Lockup object
//    */
//   constructor(unixTimestamp: number, epoch: number, custodian: PublicKey) {
//     this.unixTimestamp = unixTimestamp;
//     this.epoch = epoch;
//     this.custodian = custodian;
//   }

//   /**
//    * Default, inactive Lockup value
//    */
//   static default: Lockup = new Lockup(0, 0, PublicKey.default);
// }

// /**
//  * Create stake account transaction params
//  */
// export type CreateStakeAccountParams = {
//   /** Address of the account which will fund creation */
//   fromPubkey: PublicKey;
//   /** Address of the new stake account */
//   stakePubkey: PublicKey;
//   /** Authorities of the new stake account */
//   authorized: Authorized;
//   /** Lockup of the new stake account */
//   lockup?: Lockup;
//   /** Funding amount */
//   lamports: number;
// };

// /**
//  * Create stake account with seed transaction params
//  */
// export type CreateStakeAccountWithSeedParams = {
//   fromPubkey: PublicKey;
//   stakePubkey: PublicKey;
//   basePubkey: PublicKey;
//   seed: string;
//   authorized: Authorized;
//   lockup?: Lockup;
//   lamports: number;
// };

// /**
//  * Initialize stake instruction params
//  */
// export type InitializeStakeParams = {
//   stakePubkey: PublicKey;
//   authorized: Authorized;
//   lockup?: Lockup;
// };

// /**
//  * Delegate stake instruction params
//  */
// export type DelegateStakeParams = {
//   stakePubkey: PublicKey;
//   authorizedPubkey: PublicKey;
//   votePubkey: PublicKey;
// };

// /**
//  * Authorize stake instruction params
//  */
// export type AuthorizeStakeParams = {
//   stakePubkey: PublicKey;
//   authorizedPubkey: PublicKey;
//   newAuthorizedPubkey: PublicKey;
//   stakeAuthorizationType: StakeAuthorizationType;
//   custodianPubkey?: PublicKey;
// };

// /**
//  * Authorize stake instruction params using a derived key
//  */
// export type AuthorizeWithSeedStakeParams = {
//   stakePubkey: PublicKey;
//   authorityBase: PublicKey;
//   authoritySeed: string;
//   authorityOwner: PublicKey;
//   newAuthorizedPubkey: PublicKey;
//   stakeAuthorizationType: StakeAuthorizationType;
//   custodianPubkey?: PublicKey;
// };

// /**
//  * Split stake instruction params
//  */
// export type SplitStakeParams = {
//   stakePubkey: PublicKey;
//   authorizedPubkey: PublicKey;
//   splitStakePubkey: PublicKey;
//   lamports: number;
// };

// /**
//  * Withdraw stake instruction params
//  */
// export type WithdrawStakeParams = {
//   stakePubkey: PublicKey;
//   authorizedPubkey: PublicKey;
//   toPubkey: PublicKey;
//   lamports: number;
//   custodianPubkey?: PublicKey;
// };

// /**
//  * Deactivate stake instruction params
//  */
// export type DeactivateStakeParams = {
//   stakePubkey: PublicKey;
//   authorizedPubkey: PublicKey;
// };

// /**
//  * Merge stake instruction params
//  */
// export type MergeStakeParams = {
//   stakePubkey: PublicKey;
//   sourceStakePubKey: PublicKey;
//   authorizedPubkey: PublicKey;
// };

// /**
//  * Stake Instruction class
//  */
// export class StakeInstruction {
//   /**
//    * @internal
//    */
//   constructor() {}

//   /**
//    * Decode a stake instruction and retrieve the instruction type.
//    */
//   static decodeInstructionType(
//     instruction: TransactionInstruction,
//   ): StakeInstructionType {
//     this.checkProgramId(instruction.programId);

//     const instructionTypeLayout = BufferLayout.u32('instruction');
//     const typeIndex = instructionTypeLayout.decode(instruction.data);

//     let type: StakeInstructionType | undefined;
//     for (const [ixType, layout] of Object.entries(ATTENTION_INSTRUCTION_LAYOUTS)) {
//       // if (layout.index == typeIndex) {
//       //   type = ixType as StakeInstructionType;
//       //   break;
//       // }
//     }

//     if (!type) {
//       throw new Error('Instruction type incorrect; not a StakeInstruction');
//     }

//     return type;
//   }

//   /**
//    * Decode a initialize stake instruction and retrieve the instruction params.
//    */
//   static decodeInitialize(
//     instruction: TransactionInstruction,
//   ): InitializeStakeParams {
//     this.checkProgramId(instruction.programId);
//     this.checkKeyLength(instruction.keys, 2);

//     const {authorized, lockup} = decodeData(
//       ATTENTION_INSTRUCTION_LAYOUTS.Initialize,
//       instruction.data,
//     );

//     return {
//       stakePubkey: instruction.keys[0].pubkey,
//       authorized: new Authorized(
//         new PublicKey(authorized.staker),
//         new PublicKey(authorized.withdrawer),
//       ),
//       lockup: new Lockup(
//         lockup.unixTimestamp,
//         lockup.epoch,
//         new PublicKey(lockup.custodian),
//       ),
//     };
//   }

//   /**
//    * Decode a delegate stake instruction and retrieve the instruction params.
//    */
//   static decodeDelegate(
//     instruction: TransactionInstruction,
//   ): DelegateStakeParams {
//     this.checkProgramId(instruction.programId);
//     this.checkKeyLength(instruction.keys, 6);
//     decodeData(ATTENTION_INSTRUCTION_LAYOUTS.Delegate, instruction.data);

//     return {
//       stakePubkey: instruction.keys[0].pubkey,
//       votePubkey: instruction.keys[1].pubkey,
//       authorizedPubkey: instruction.keys[5].pubkey,
//     };
//   }

//   /**
//    * Decode an authorize stake instruction and retrieve the instruction params.
//    */
//   static decodeAuthorize(
//     instruction: TransactionInstruction,
//   ): AuthorizeStakeParams {
//     this.checkProgramId(instruction.programId);
//     this.checkKeyLength(instruction.keys, 3);
//     const {newAuthorized, stakeAuthorizationType} = decodeData(
//       ATTENTION_INSTRUCTION_LAYOUTS.Authorize,
//       instruction.data,
//     );

//     const o: AuthorizeStakeParams = {
//       stakePubkey: instruction.keys[0].pubkey,
//       authorizedPubkey: instruction.keys[2].pubkey,
//       newAuthorizedPubkey: new PublicKey(newAuthorized),
//       stakeAuthorizationType: {
//         index: stakeAuthorizationType,
//       },
//     };
//     if (instruction.keys.length > 3) {
//       o.custodianPubkey = instruction.keys[3].pubkey;
//     }
//     return o;
//   }

//   /**
//    * Decode an authorize-with-seed stake instruction and retrieve the instruction params.
//    */
//   static decodeAuthorizeWithSeed(
//     instruction: TransactionInstruction,
//   ): AuthorizeWithSeedStakeParams {
//     this.checkProgramId(instruction.programId);
//     this.checkKeyLength(instruction.keys, 2);

//     const {
//       newAuthorized,
//       stakeAuthorizationType,
//       authoritySeed,
//       authorityOwner,
//     } = decodeData(
//       ATTENTION_INSTRUCTION_LAYOUTS.AuthorizeWithSeed,
//       instruction.data,
//     );

//     const o: AuthorizeWithSeedStakeParams = {
//       stakePubkey: instruction.keys[0].pubkey,
//       authorityBase: instruction.keys[1].pubkey,
//       authoritySeed: authoritySeed,
//       authorityOwner: new PublicKey(authorityOwner),
//       newAuthorizedPubkey: new PublicKey(newAuthorized),
//       stakeAuthorizationType: {
//         index: stakeAuthorizationType,
//       },
//     };
//     if (instruction.keys.length > 3) {
//       o.custodianPubkey = instruction.keys[3].pubkey;
//     }
//     return o;
//   }

//   /**
//    * Decode a split stake instruction and retrieve the instruction params.
//    */
//   static decodeSplit(instruction: TransactionInstruction): SplitStakeParams {
//     this.checkProgramId(instruction.programId);
//     this.checkKeyLength(instruction.keys, 3);
//     const {lamports} = decodeData(
//       ATTENTION_INSTRUCTION_LAYOUTS.Split,
//       instruction.data,
//     );

//     return {
//       stakePubkey: instruction.keys[0].pubkey,
//       splitStakePubkey: instruction.keys[1].pubkey,
//       authorizedPubkey: instruction.keys[2].pubkey,
//       lamports,
//     };
//   }

//   /**
//    * Decode a merge stake instruction and retrieve the instruction params.
//    */
//   static decodeMerge(instruction: TransactionInstruction): MergeStakeParams {
//     this.checkProgramId(instruction.programId);
//     this.checkKeyLength(instruction.keys, 3);
//     decodeData(ATTENTION_INSTRUCTION_LAYOUTS.Merge, instruction.data);

//     return {
//       stakePubkey: instruction.keys[0].pubkey,
//       sourceStakePubKey: instruction.keys[1].pubkey,
//       authorizedPubkey: instruction.keys[4].pubkey,
//     };
//   }

//   /**
//    * Decode a withdraw stake instruction and retrieve the instruction params.
//    */
//   static decodeWithdraw(
//     instruction: TransactionInstruction,
//   ): WithdrawStakeParams {
//     this.checkProgramId(instruction.programId);
//     this.checkKeyLength(instruction.keys, 5);
//     const {lamports} = decodeData(
//       ATTENTION_INSTRUCTION_LAYOUTS.Withdraw,
//       instruction.data,
//     );

//     const o: WithdrawStakeParams = {
//       stakePubkey: instruction.keys[0].pubkey,
//       toPubkey: instruction.keys[1].pubkey,
//       authorizedPubkey: instruction.keys[4].pubkey,
//       lamports,
//     };
//     if (instruction.keys.length > 5) {
//       o.custodianPubkey = instruction.keys[5].pubkey;
//     }
//     return o;
//   }

//   /**
//    * Decode a deactivate stake instruction and retrieve the instruction params.
//    */
//   static decodeDeactivate(
//     instruction: TransactionInstruction,
//   ): DeactivateStakeParams {
//     this.checkProgramId(instruction.programId);
//     this.checkKeyLength(instruction.keys, 3);
//     decodeData(ATTENTION_INSTRUCTION_LAYOUTS.Deactivate, instruction.data);

//     return {
//       stakePubkey: instruction.keys[0].pubkey,
//       authorizedPubkey: instruction.keys[2].pubkey,
//     };
//   }

//   /**
//    * @internal
//    */
//   static checkProgramId(programId: PublicKey) {
//     if (!programId.equals(AttentionProgram.programId)) {
//       throw new Error('invalid instruction; programId is not StakeProgram');
//     }
//   }

//   /**
//    * @internal
//    */
//   static checkKeyLength(keys: Array<any>, expectedLength: number) {
//     if (keys.length < expectedLength) {
//       throw new Error(
//         `invalid instruction; found ${keys.length} keys, expected at least ${expectedLength}`,
//       );
//     }
//   }
// }

/**
 * An enumeration of valid StakeInstructionType's
 */
export type AttentionInstructionType =
  | 'RegisterRecipient'
  | 'SubmitPorts'

/**
 * An enumeration of valid stake InstructionType's
 * @internal
 */
export const ATTENTION_INSTRUCTION_LAYOUTS: any = Object.freeze({
  RegisterRecipient: {
    index: 0,
    layout: BufferLayout.struct([
      BufferLayout.u32('instruction'),
      Layout.rustString(),
      Layout.uint64(),
    ]),
  },
  SubmitPorts: {
    index: 1,
    layout: BufferLayout.struct([
      BufferLayout.u32('instruction'),
      Layout.publicKey('newAuthorized')
    ]),
  }
});

// /**
//  * Stake authorization type
//  */
// export type StakeAuthorizationType = {
//   /** The Stake Authorization index (from solana-stake-program) */
//   index: number;
// };

// /**
//  * An enumeration of valid StakeAuthorizationLayout's
//  */
// export const StakeAuthorizationLayout = Object.freeze({
//   Staker: {
//     index: 0,
//   },
//   Withdrawer: {
//     index: 1,
//   },
// });

/**
 * Factory class for transactions to interact with the Stake program
 */
export class AttentionProgram {
  /**
   * @internal
   */
  constructor() {}

  /**
   * Public key that identifies the Stake program
   */
  static programId: PublicKey = new PublicKey(
    'Attention2222222222222222222222222222222222',
  );

  /**
   * Max space of a Stake account
   *
   * This is generated from the solana-stake-program StakeState struct as
   * `std::mem::size_of::<StakeState>()`:
   * https://docs.rs/solana-stake-program/1.4.4/solana_stake_program/stake_state/enum.StakeState.html
   */
  static space: number = 200;

  /**
   * Generate an Initialize instruction to add to a Stake Create transaction
   */
  static SubmitPorts(params: any): Transaction {
    const {
      stakePubkey,
      accountDataPubkey
    } = params;
    const type = ATTENTION_INSTRUCTION_LAYOUTS.SubmitPorts;
    const data = encodeData(type, {
      account: toBuffer(accountDataPubkey.toBuffer())
    });

    const keys = [
      {pubkey: stakePubkey, isSigner: false, isWritable: true},
      {pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: true},
      {pubkey: accountDataPubkey, isSigner: false, isWritable: false},

    ];
    console.log('KEYS',keys);
    // if (custodianPubkey) {
    //   keys.push({pubkey: custodianPubkey, isSigner: false, isWritable: false});
    // }
    return new Transaction().add({
      keys,
      programId: this.programId,
      data,
    });
  }

  /**
   * Generate a Transaction that creates a new Stake account at
   *   an address generated with `from`, a seed, and the Stake programId
   */
  static createAccountWithSeed(
    params: any,
  ): Transaction {
    const transaction = new Transaction();
    transaction.add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: params.fromPubkey,
        newAccountPubkey: params.stakePubkey,
        basePubkey: params.basePubkey,
        seed: params.seed,
        lamports: params.lamports,
        space: this.space,
        programId: this.programId,
      }),
    );

    return transaction;
  }

  /**
   * Generate a Transaction that creates a new Stake account
   */
  static createAccount(params: any): Transaction {
    const transaction = new Transaction();
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: params.fromPubkey,
        newAccountPubkey: params.stakePubkey,
        lamports: params.lamports,
        space: this.space,
        programId: this.programId,
      }),
    );
    return transaction;
  }

  /**
   * Generate a Transaction that delegates Stake tokens to a validator
   * Vote PublicKey. This transaction can also be used to redelegate Stake
   * to a new validator Vote PublicKey.
   */
  static delegate(params: any): Transaction {
    const {stakePubkey, authorizedPubkey, votePubkey} = params;

    const type = ATTENTION_INSTRUCTION_LAYOUTS.Delegate;
    const data = encodeData(type);

    return new Transaction().add({
      keys: [
        {pubkey: stakePubkey, isSigner: false, isWritable: true},
        {pubkey: votePubkey, isSigner: false, isWritable: false},
        {pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false},
        {
          pubkey: SYSVAR_STAKE_HISTORY_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
        {pubkey: ATTENTION_CONFIG_ID, isSigner: false, isWritable: false},
        {pubkey: authorizedPubkey, isSigner: true, isWritable: false},
      ],
      programId: this.programId,
      data,
    });
  }

  /**
   * Generate a Transaction that authorizes a new PublicKey as Staker
   * or Withdrawer on the Stake account.
   */
  static authorize(params: any): Transaction {
    const {
      stakePubkey,
      authorizedPubkey,
      newAuthorizedPubkey,
      stakeAuthorizationType,
      custodianPubkey,
    } = params;

    const type = ATTENTION_INSTRUCTION_LAYOUTS.Authorize;
    const data = encodeData(type, {
      newAuthorized: toBuffer(newAuthorizedPubkey.toBuffer()),
      stakeAuthorizationType: stakeAuthorizationType.index,
    });

    const keys = [
      {pubkey: stakePubkey, isSigner: false, isWritable: true},
      {pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: true},
      {pubkey: authorizedPubkey, isSigner: true, isWritable: false},
    ];
    if (custodianPubkey) {
      keys.push({pubkey: custodianPubkey, isSigner: false, isWritable: false});
    }
    return new Transaction().add({
      keys,
      programId: this.programId,
      data,
    });
  }

  /**
   * Generate a Transaction that authorizes a new PublicKey as Staker
   * or Withdrawer on the Stake account.
   */
  static authorizeWithSeed(params: any): Transaction {
    const {
      stakePubkey,
      authorityBase,
      authoritySeed,
      authorityOwner,
      newAuthorizedPubkey,
      stakeAuthorizationType,
      custodianPubkey,
    } = params;

    const type = ATTENTION_INSTRUCTION_LAYOUTS.AuthorizeWithSeed;
    const data = encodeData(type, {
      newAuthorized: toBuffer(newAuthorizedPubkey.toBuffer()),
      stakeAuthorizationType: stakeAuthorizationType.index,
      authoritySeed: authoritySeed,
      authorityOwner: toBuffer(authorityOwner.toBuffer()),
    });

    const keys = [
      {pubkey: stakePubkey, isSigner: false, isWritable: true},
      {pubkey: authorityBase, isSigner: true, isWritable: false},
      {pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false},
    ];
    if (custodianPubkey) {
      keys.push({pubkey: custodianPubkey, isSigner: false, isWritable: false});
    }
    return new Transaction().add({
      keys,
      programId: this.programId,
      data,
    });
  }

  /**
   * Generate a Transaction that splits Stake tokens into another stake account
   */
  static split(params: any): Transaction {
    const {stakePubkey, authorizedPubkey, splitStakePubkey, lamports} = params;

    const transaction = new Transaction();
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: authorizedPubkey,
        newAccountPubkey: splitStakePubkey,
        lamports: 0,
        space: this.space,
        programId: this.programId,
      }),
    );
    const type = ATTENTION_INSTRUCTION_LAYOUTS.Split;
    const data = encodeData(type, {lamports});

    return transaction.add({
      keys: [
        {pubkey: stakePubkey, isSigner: false, isWritable: true},
        {pubkey: splitStakePubkey, isSigner: false, isWritable: true},
        {pubkey: authorizedPubkey, isSigner: true, isWritable: false},
      ],
      programId: this.programId,
      data,
    });
  }

  /**
   * Generate a Transaction that merges Stake accounts.
   */
  static merge(params: any): Transaction {
    const {stakePubkey, sourceStakePubKey, authorizedPubkey} = params;
    const type = ATTENTION_INSTRUCTION_LAYOUTS.Merge;
    const data = encodeData(type);

    return new Transaction().add({
      keys: [
        {pubkey: stakePubkey, isSigner: false, isWritable: true},
        {pubkey: sourceStakePubKey, isSigner: false, isWritable: true},
        {pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false},
        {
          pubkey: SYSVAR_STAKE_HISTORY_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
        {pubkey: authorizedPubkey, isSigner: true, isWritable: false},
      ],
      programId: this.programId,
      data,
    });
  }

  /**
   * Generate a Transaction that withdraws deactivated Stake tokens.
   */
  static withdraw(params: any): Transaction {
    const {stakePubkey, authorizedPubkey, toPubkey, lamports, custodianPubkey} =
      params;
    const type = ATTENTION_INSTRUCTION_LAYOUTS.Withdraw;
    const data = encodeData(type, {lamports});

    const keys = [
      {pubkey: stakePubkey, isSigner: false, isWritable: true},
      {pubkey: toPubkey, isSigner: false, isWritable: true},
      {pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false},
      {
        pubkey: SYSVAR_STAKE_HISTORY_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
      {pubkey: authorizedPubkey, isSigner: true, isWritable: false},
    ];
    if (custodianPubkey) {
      keys.push({pubkey: custodianPubkey, isSigner: false, isWritable: false});
    }
    return new Transaction().add({
      keys,
      programId: this.programId,
      data,
    });
  }

  /**
   * Generate a Transaction that deactivates Stake tokens.
   */
  static deactivate(params: any): Transaction {
    const {stakePubkey, authorizedPubkey} = params;
    const type = ATTENTION_INSTRUCTION_LAYOUTS.Deactivate;
    const data = encodeData(type);

    return new Transaction().add({
      keys: [
        {pubkey: stakePubkey, isSigner: false, isWritable: true},
        {pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false},
        {pubkey: authorizedPubkey, isSigner: true, isWritable: false},
      ],
      programId: this.programId,
      data,
    });
  }
}
