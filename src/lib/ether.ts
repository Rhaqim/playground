import { BrowserProvider } from "ethers";
import detectProvider from '@metamask/detect-provider';

export class Web3Provider {
    provider: BrowserProvider;

    constructor(provider: BrowserProvider) {
        this.provider = provider;
    }

    static async init(): Promise<Web3Provider> {
        const metamaskProvider = await detectProvider() as any;

        if (metamaskProvider === null) {
            throw new Error("Metamask not installed");
        }

        const provider = new BrowserProvider(metamaskProvider, "any");

        return new Web3Provider(provider);
    }

    async userAddress(): Promise<string> {
        const signer = await this.provider.getSigner();

        return signer.getAddress()
    }

    async sign(message: string) {
        const signer = await this.provider.getSigner();

        return signer.signMessage(message);
    }
}
