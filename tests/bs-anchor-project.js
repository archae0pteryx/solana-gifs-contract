const anchor = require('@project-serum/anchor')

const { SystemProgram } = anchor.web3

const main = async () => {
  console.log('🚀 Starting test...')

  const provider = anchor.Provider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.BsAnchorProject

  const baseAccount = anchor.web3.Keypair.generate()

  let tx = await program.rpc.initialize({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  })
  console.log('transaction signature', tx)

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey)
  console.log('👀 GIF Count', account.totalGifs.toString())

  // Call add_gif!
  await program.rpc.addGif(
    'https://media.giphy.com/media/sKBaE2Hl60KnzjTVXb/giphy.gif',
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    }
  )
  await program.rpc.updootGif(0, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  })
  // Get the account again to see what changed.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey)
  console.log('👀 GIF Count', account.totalGifs.toString())

  console.log('GIF List', account.gifList)
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

runMain()
