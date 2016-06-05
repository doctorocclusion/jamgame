package blue.made.jamgame;

import blue.made.jamgame.engine.swing.SwingGameGrid;

import java.awt.*;

/**
 * Created by Sam Sartor on 6/5/2016.
 */
public class Main {
	public static class GameTile extends SwingGameGrid.Tile {
		public Color color = Color.DARK_GRAY;

		public GameTile(SwingGameGrid<?> game, int x, int y) {
			super(game, x, y);
		}

		@Override
		public void draw(Graphics2D g, int px0, int py0, int w, int h) {
			g.setColor(color);
			g.fillRect(px0, py0, w, h);
			g.setColor(Color.BLACK);
			g.drawRect(px0, py0, w, h);
		}
	}

	public static class Data {
		int lastmx = -1;
		int lastmy = -1;
	}

	public static void main(String[] args) {
		final Data d = new Data();
		final SwingGameGrid<GameTile> game = new SwingGameGrid<>(50, 50, GameTile::new);
		game.onMouseMove(() -> {
			if (game.inGrid(d.lastmx, d.lastmy)) {
				game.at(d.lastmx, d.lastmy).color = Color.GRAY;
			}
			if (game.isMouseIn()) {
				int x = (int) game.getMouseX();
				int y = (int) game.getMouseY();
				if (game.inGrid(x, y)) game.at(x, y).color = Color.LIGHT_GRAY;
				if (x != d.lastmx || y != d.lastmy) game.notifyRedraw();
				d.lastmx = x;
				d.lastmy = y;
			}
		});
		game.openUI();
	}
}
