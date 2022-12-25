	class Quad{

		_vertexPosData = new Float32Array([
			-0.5, 0.5,
			-0.5, -0.5,
			0.5, 0.5,
			-0.5, -0.5,
			0.5, 0.5,
			0.5, -0.5,
		]);

		constructor(){		
		}
		setRect(x, y, width, height){

			//_x = x; _y = y; _width = width; _height = height;

			_vertexPosData[0] = x;//top left
			_vertexPosData[1] = y + height;//top left

			_vertexPosData[2] = x + width;//top right
			_vertexPosData[3] = y + height;//top right

			_vertexPosData[4] = x;//bottom left
			_vertexPosData[5] = y;//bottom left

			_vertexPosData[6] = x + width; //top right
			_vertexPosData[7] = y + height;//top right

			_vertexPosData[8] = x;//bottom left
			_vertexPosData[9] = y;//bottom left

			_vertexPosData[10] = x + width;//bottom right
			_vertexPosData[11] = y;//bottom right
		}

		_x; _y;
		_width; _height;
	}