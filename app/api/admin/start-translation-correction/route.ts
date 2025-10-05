
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Check if process is already running synchronously
    const { execSync } = require('child_process');
    
    try {
      const runningProcesses = execSync('ps aux | grep "optimized-translation-corrector" | grep -v grep', { 
        encoding: 'utf8',
        timeout: 5000 
      });
      
      if (runningProcesses.trim()) {
        return NextResponse.json({
          success: false,
          message: 'El proceso de corrección ya está ejecutándose'
        });
      }
    } catch (checkError) {
      // No process running, continue
    }

    console.log('🚀 Iniciando proceso de traducción automática...');

    // Start the optimized translation corrector
    const scriptPath = path.join(process.cwd(), 'scripts', 'optimized-translation-corrector.ts');
    
    const child = spawn('npx', ['tsx', scriptPath], {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: process.cwd(),
      env: { ...process.env }
    });

    // Log output
    const logPath = path.join(process.cwd(), 'correction.log');
    const fs = require('fs');
    
    // Clear previous log
    fs.writeFileSync(logPath, `=== NUEVA SESIÓN DE TRADUCCIÓN ===\n${new Date().toISOString()}\n\n`);
    
    child.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log('SCRIPT OUTPUT:', output);
      fs.appendFileSync(logPath, output);
    });

    child.stderr?.on('data', (data) => {
      const error = data.toString();
      console.error('SCRIPT ERROR:', error);
      fs.appendFileSync(logPath, `ERROR: ${error}`);
    });

    child.on('error', (error) => {
      console.error('Child process error:', error);
      fs.appendFileSync(logPath, `PROCESS ERROR: ${error}\n`);
    });

    child.on('exit', (code) => {
      console.log(`Script exited with code: ${code}`);
      fs.appendFileSync(logPath, `\nProcess exited with code: ${code}\n`);
    });

    child.unref(); // Allow the parent to exit independently

    // Give the process a moment to start
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`✅ Proceso iniciado con PID: ${child.pid}`);

    return NextResponse.json({
      success: true,
      message: 'Proceso de corrección iniciado exitosamente',
      pid: child.pid
    });

  } catch (error) {
    console.error('❌ Error starting correction process:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error starting correction process',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
