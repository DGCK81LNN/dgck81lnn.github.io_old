export async function main() {

    SoulLC.title("SoulLC Hello World");
    let line = SoulLC.getLine();
    SoulLC.println("Hello, world!");
    SoulLC.print("Your name: ");
    SoulLC.revertLine(line);
    SoulLC.println(`Hello, ${await SoulLC.input()}!`);
    await SoulLC.sleep(1000);
    SoulLC.println("Press any key to quit");
    await SoulLC.getch();
}
