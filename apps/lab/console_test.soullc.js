export async function main() {

    SoulLC.title("SoulLC Hello World");
    SoulLC.print("Your name: ");
    SoulLC.println(`Hello, ${await SoulLC.input()}!`);
    await SoulLC.sleep(1000);
    SoulLC.println("Press any key to quit");
    await SoulLC.getch();
}