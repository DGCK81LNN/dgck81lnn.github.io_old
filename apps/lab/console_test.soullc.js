export async function main() {
    SoulLC.title("SoulLC Hello World");
    let line = SoulLC.getLine();
    SoulLC.println("Hello, world!");
    SoulLC.print("Your name: ");
    let name = await SoulLC.input();
    SoulLC.revertLine(line);
    SoulLC.println(`Hello, ${name}!`);
    SoulLC.println(`Your name: ${name}`);
    SoulLC.println();
    await SoulLC.sleep(1000);
    SoulLC.println("Press any key to quit");
    await SoulLC.getch();
}
