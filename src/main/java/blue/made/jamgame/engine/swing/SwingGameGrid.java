package blue.made.jamgame.engine.swing;

import java.awt.*;

/**
 * Created by Sam Sartor on 6/5/2016.
 */
public class SwingGameGrid<T extends SwingGameGrid.Tile> extends SwingGame {
	public static abstract class Tile {
		public final int x;
		public final int y;
		public final SwingGameGrid<?> game;

		public Tile(SwingGameGrid<?> game, int x, int y) {
			this.x = x;
			this.y = y;
			this.game = game;
		}

		public abstract void draw(Graphics2D g, int px0, int py0, int w, int h);
	}

	public static interface CreateTile<T extends SwingGameGrid.Tile> {
		public T make(SwingGameGrid<T> game, int x, int y);
	}

	public final int width;
	public final int height;
	private Object[][] tiles;

	public SwingGameGrid(int width, int height, CreateTile<T> makeTiles) {
		this.width = width;
		this.height = height;
		tiles = new Object[width][height];
		for (int x = 0; x < width; x++) {
			for (int y = 0; y < height; y++) {
				tiles[x][y] = makeTiles.make(this, x, y);
			}
		}
		setCamera(width / 2, height / 2, Math.max(width, height), false, 10);
		addPainter(g -> {
			int s = (int) drawScale + 1;
			double dx = 0;
			for (int x = 0; x < width; x++) {
				double dy = 0;
				for (int y = 0; y < height; y++) {
					Tile t = (Tile) tiles[x][y];
					t.draw(g, (int) dx, (int) dy, s, s);
					dy += drawScale;
				}
				dx += drawScale;
			}
		});
	}

	public boolean inGrid(double x, double y) {
		return x >= 0 && y >= 0 && x < width && y < height;
	}

	public T at(int x, int y) {
		if (x < 0 || y < 0 || x >= width || y >= width) return null;
		return (T) tiles[x][y];
	}
}
