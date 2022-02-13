
precision mediump float;

varying vec4 v_Position;

uniform vec4 begin_color;

uniform vec4 dest_color; 

// HOMEWORK 3 - TODO
/*
	The fragment shader is where pixel colors are decided.
	You'll have to modify this code to make the circle vary between 2 colors.
	Currently this will render the exact same thing as the gradient_circle shaders
*/
void main(){

	// Default alpha is 0
	float alpha = 1.0;

	// Radius is 0.5, since the diameter of our quad is 1
	float radius = 0.5;

	// Get the distance squared of from (0, 0)
	float dist_sq = v_Position.x*v_Position.x + v_Position.y*v_Position.y;

	if(dist_sq >= radius*radius){
		// Multiply by 4, since distance squared is at most 0.25
		alpha = 0.0;
	}

	float mixValue = smoothstep(-sqrt(2.0), sqrt(2.0), v_Position.x + v_Position.y);
	vec4 newColor = mix(begin_color, dest_color, mixValue);

	// Use the alpha value in our color
	gl_FragColor = vec4(newColor);
	gl_FragColor.a = alpha;
	
}