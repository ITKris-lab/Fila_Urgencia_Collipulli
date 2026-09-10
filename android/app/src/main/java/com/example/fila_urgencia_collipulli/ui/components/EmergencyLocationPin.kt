package com.example.fila_urgencia_collipulli.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.fila_urgencia_collipulli.R

@Composable
fun EmergencyLocationPin(
    modifier: Modifier = Modifier,
    primaryColor: Color = Color(0xFFFF6B6B),
    secondaryColor: Color = Color(0xFFF02A65),
    outlineColor: Color = Color(0xFF0A1D56),
    innerCircleColor: Color = Color.White,
    plusSignColor: Color = Color(0xFFD80032),
    groundColor: Color = Color(0xFFC7D3FF)
) {
    val description = stringResource(id = R.string.emergency_location_pin_desc)
    Canvas(
        modifier = modifier
            .size(200.dp)
            .padding(16.dp)
            .semantics { contentDescription = description }
    ) {
        val width = size.width
        val height = size.height

        // 1. Ground Ellipse
        val groundHeight = height * 0.18f
        val groundWidth = width * 0.85f
        val groundLeft = (width - groundWidth) / 2
        val groundTop = height - groundHeight
        val strokeWidth = 16f

        // Ground Outline
        drawOval(
            color = outlineColor,
            topLeft = Offset(groundLeft, groundTop),
            size = Size(groundWidth, groundHeight)
        )
        // Ground Fill
        drawOval(
            color = groundColor,
            topLeft = Offset(groundLeft + strokeWidth / 2, groundTop + strokeWidth / 2),
            size = Size(groundWidth - strokeWidth, groundHeight - strokeWidth)
        )

        // 2. Pin Path
        val pinWidth = width * 0.8f
        val pinHeight = height * 0.85f
        val centerX = width / 2
        val pinTop = 0f
        val pinBottom = pinHeight
        val radius = pinWidth / 2

        val pinPath = Path().apply {
            moveTo(centerX, pinBottom)
            // Left curve
            cubicTo(
                centerX - pinWidth * 0.55f, pinBottom * 0.75f,
                centerX - pinWidth * 0.5f, pinTop + radius * 0.2f,
                centerX - radius, pinTop + radius
            )
            // Top circle
            arcTo(
                rect = Rect(centerX - radius, pinTop, centerX + radius, pinTop + radius * 2),
                startAngleDegrees = 180f,
                sweepAngleDegrees = 180f,
                forceMoveTo = false
            )
            // Right curve
            cubicTo(
                centerX + pinWidth * 0.5f, pinTop + radius * 0.2f,
                centerX + pinWidth * 0.55f, pinBottom * 0.75f,
                centerX, pinBottom
            )
            close()
        }

        // Pin Outline
        drawPath(
            path = pinPath,
            color = outlineColor,
            style = Stroke(width = strokeWidth * 1.5f, cap = StrokeCap.Round, join = StrokeJoin.Round)
        )

        // Pin Fill with diagonal split
        drawPath(
            path = pinPath,
            brush = Brush.linearGradient(
                colors = listOf(primaryColor, primaryColor, secondaryColor, secondaryColor),
                start = Offset(centerX - radius, pinTop),
                end = Offset(centerX + radius, pinBottom),
                stops = listOf(0f, 0.45f, 0.45f, 1f)
            )
        )

        // 3. Inner White Circle
        val innerCircleRadius = radius * 0.6f
        val innerCircleCenter = Offset(centerX, pinTop + radius)

        // Circle Outline
        drawCircle(
            color = outlineColor,
            radius = innerCircleRadius + strokeWidth / 2,
            center = innerCircleCenter
        )
        // Circle Fill
        drawCircle(
            color = innerCircleColor,
            radius = innerCircleRadius,
            center = innerCircleCenter
        )

        // 4. Plus Sign
        val plusSize = innerCircleRadius * 1.1f
        val plusThickness = plusSize * 0.3f
        
        val plusPath = Path().apply {
            val hS = plusSize / 2
            val hT = plusThickness / 2
            
            moveTo(innerCircleCenter.x - hS, innerCircleCenter.y - hT)
            lineTo(innerCircleCenter.x - hT, innerCircleCenter.y - hT)
            lineTo(innerCircleCenter.x - hT, innerCircleCenter.y - hS)
            lineTo(innerCircleCenter.x + hT, innerCircleCenter.y - hS)
            lineTo(innerCircleCenter.x + hT, innerCircleCenter.y - hT)
            lineTo(innerCircleCenter.x + hS, innerCircleCenter.y - hT)
            lineTo(innerCircleCenter.x + hS, innerCircleCenter.y + hT)
            lineTo(innerCircleCenter.x + hT, innerCircleCenter.y + hT)
            lineTo(innerCircleCenter.x + hT, innerCircleCenter.y + hS)
            lineTo(innerCircleCenter.x - hT, innerCircleCenter.y + hS)
            lineTo(innerCircleCenter.x - hT, innerCircleCenter.y + hT)
            lineTo(innerCircleCenter.x - hS, innerCircleCenter.y + hT)
            close()
        }

        // Plus Sign Outline
        drawPath(
            path = plusPath,
            color = outlineColor,
            style = Stroke(width = strokeWidth, cap = StrokeCap.Round, join = StrokeJoin.Round)
        )
        // Plus Sign Fill
        drawPath(
            path = plusPath,
            color = plusSignColor
        )
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF000000)
@Composable
fun EmergencyLocationPinPreview() {
    Box(
        modifier = Modifier.size(250.dp),
        contentAlignment = Alignment.Center
    ) {
        EmergencyLocationPin()
    }
}
