export async function main() {
    SoulLC.title("SoulLC Hello World");
    SoulLC.color(0, 2);
    SoulLC.println("欢迎使用灵魂实验室控制台！");
    SoulLC.color();
    SoulLC.println();
    SoulLC.println("使用方法：");
    SoulLC.color(9);
    SoulLC.print("/apps/lab/console.html?path=");
    SoulLC.color(12);
    SoulLC.println("{path}");
    SoulLC.color();
    SoulLC.println("其中，path为要加载的脚本的路径，其中必须有斜杠。");
    SoulLC.println();
    SoulLC.println("以下是一个Hello World。");
    SoulLC.println();
    let line = SoulLC.getLine();
    SoulLC.println("Hello, world!");
    SoulLC.print("输入你的名字：");
    SoulLC.color(11);
    let name = await SoulLC.input();
    SoulLC.color();
    SoulLC.revertLine(line);
    SoulLC.print("Hello, ");
    SoulLC.color(11);
    SoulLC.print(name);
    SoulLC.color();
    SoulLC.println("!");
    SoulLC.color(8);
    SoulLC.print("输入你的名字：");
    SoulLC.color(3);
    SoulLC.println(name);
    SoulLC.color();
    SoulLC.println();
    await SoulLC.sleep(1000);
    SoulLC.println("按任意键退出...");
    await SoulLC.getch();
}
