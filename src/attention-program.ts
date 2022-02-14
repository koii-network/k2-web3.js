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
      // Layout.rustString("recipient"),
      // BufferLayout.ns64("shares"),
      Layout.publicKey('owner')
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

/**
 * Factory class for transactions to interact with the Attention program
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
   * Max space of a Attention account
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
      attentionPubkey,
      accountDataPubkey
    } = params;
    const type = ATTENTION_INSTRUCTION_LAYOUTS.SubmitPorts;
    const data = encodeData(type, {
      account: toBuffer(accountDataPubkey.toBuffer())
    });

    const keys = [
      {pubkey: attentionPubkey, isSigner: false, isWritable: true},
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
   * Generate an Initialize instruction to add to a Stake Create transaction
   */
   static RegisterRecipient(params: any): Transaction {
    const {
      attentionPubkey,
      nftPubKeyStr,
      ownerPubKey,
      accountDataPubkey
    } = params;
    const type = ATTENTION_INSTRUCTION_LAYOUTS.RegisterRecipient;
    const data = encodeData(type, {
      // recipient: nftPubKeyStr,
      // shares:100000,
      owner: toBuffer(ownerPubKey.toBuffer())
    });

    const keys = [
      {pubkey: attentionPubkey, isSigner: false, isWritable: true},
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
   * Generate a Transaction that creates a new Attention account
   */
  static createAccount(params: any): Transaction {
    const transaction = new Transaction();
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: params.fromPubkey,
        newAccountPubkey: params.stakePubkey,
        lamports: params.lamports,
        space: params.space,
        programId: this.programId,
      }),
    );
    return transaction;
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
